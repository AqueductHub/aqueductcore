import { renderHook, act } from '@testing-library/react';
import toast from 'react-hot-toast';
import { useContext } from 'react';

import { client } from 'API/apolloClientConfig';
import { AQD_FILE_URI } from 'constants/api';
import useFileUpload from './useUploadFile';

jest.mock('react-hot-toast');

jest.mock('react', () => ({
    ...jest.requireActual('react'),
    useContext: jest.fn(),
}));

jest.mock('API/apolloClientConfig', () => ({
    client: {
        refetchQueries: jest.fn(),
    },
}));

global.fetch = jest.fn();

let setSelectedFileMock: jest.Mock;

beforeEach(() => {
    setSelectedFileMock = jest.fn();
    (useContext as jest.Mock).mockReturnValue({
        setSelectedFile: setSelectedFileMock,
    });
    (fetch as jest.Mock).mockClear();
    (client.refetchQueries as jest.Mock).mockClear();
});

test('should handle successful file upload', async () => {
    const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({ result: 'Upload success!' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUpload('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileUpload(new File(['dummy content'], 'test.txt', { type: 'text/plain' }));
    });

    expect(fetch).toHaveBeenCalledWith(`${AQD_FILE_URI}/api/files/test-uuid`, expect.any(Object));
    expect(client.refetchQueries).toHaveBeenCalledWith({
        include: 'active',
    });
    expect(setSelectedFileMock).toHaveBeenCalledWith('test.txt');
    expect(toast.success).toHaveBeenCalledWith('Upload success!' ?? 'File uploaded successfully!', {
        id: 'upload_success' + 'test.txt',
    });
});

test('should handle failed file upload with error message', async () => {
    const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ detail: 'Upload failed!' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUpload('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileUpload(new File(['dummy content'], 'test.txt', { type: 'text/plain' }));
    });

    expect(toast.error).toHaveBeenCalledWith(
        `file name: "test.txt"\nUpload failed!`,
        {
            id: 'upload_failedtest.txt',
        }
    );
});

test('should handle failed file upload without error message', async () => {
    const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockRejectedValue(new Error('Failed to parse JSON')),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileUpload('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileUpload(new File(['dummy content'], 'test.txt', { type: 'text/plain' }));
    });

    expect(toast.error).toHaveBeenCalledWith(
        `file name: "test.txt"\nBad Request`,
        {
            id: 'upload_catchtest.txt',
        }
    );
});

test('should handle fetch failure', async () => {
    const mockError = new Error('Network Error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileUpload('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileUpload(new File(['dummy content'], 'test.txt', { type: 'text/plain' }));
    });

    expect(toast.error).toHaveBeenCalledWith(
        `file name: "test.txt"\nNetwork Error`,
        {
            id: 'file_catchtest.txt',
        }
    );
});
