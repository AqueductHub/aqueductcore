import { renderHook, act } from '@testing-library/react';
import toast from 'react-hot-toast';

import { client } from 'API/apolloClientConfig';
import { AQD_FILE_URI } from 'constants/api';
import useFileDelete from './useDeleteFile';

jest.mock('react-hot-toast');

jest.mock('API/apolloClientConfig', () => ({
    client: {
        refetchQueries: jest.fn(),
    },
}));

global.fetch = jest.fn();

beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    (client.refetchQueries as jest.Mock).mockClear();
});

test('should handle successful file deletion', async () => {
    const mockResponse = {
        status: 200,
        json: jest.fn().mockResolvedValue({ result: 'Delete success!' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileDelete('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileDelete('test.txt');
    });

    expect(fetch).toHaveBeenCalledWith(`${AQD_FILE_URI}/api/files/test-uuid`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_list: ['test.txt'] }),
    });
    expect(client.refetchQueries).toHaveBeenCalledWith({
        include: 'active',
    });
    expect(toast.success).toHaveBeenCalledWith('Delete success!' ?? 'File deleted successfully!', {
        id: 'delete_success',
    });
});

test('should handle failed file deletion with error message', async () => {
    const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockResolvedValue({ detail: 'Delete failed!' }),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileDelete('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileDelete('test.txt');
    });

    expect(toast.error).toHaveBeenCalledWith(
        `File name: "test.txt"\nDelete failed!`,
        {
            id: 'delete_failed_test.txt',
        }
    );
});

test('should handle failed file deletion without error message', async () => {
    const mockResponse = {
        status: 400,
        statusText: 'Bad Request',
        json: jest.fn().mockRejectedValue(new Error('Failed to parse JSON')),
    };
    (fetch as jest.Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useFileDelete('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileDelete('test.txt');
    });

    expect(toast.error).toHaveBeenCalledWith(
        `File name: "test.txt"\nBad Request`,
        {
            id: 'delete_catch_test.txt',
        }
    );
});

test('should handle fetch failure', async () => {
    const mockError = new Error('Network Error');
    (fetch as jest.Mock).mockRejectedValue(mockError);

    const { result } = renderHook(() => useFileDelete('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileDelete('test.txt');
    });

    expect(toast.error).toHaveBeenCalledWith(
        `File name: "test.txt"\nNetwork Error`,
        {
            id: 'file_delete_catch_test.txt',
        }
    );
});

test('should handle invalid file name', async () => {
    const { result } = renderHook(() => useFileDelete('test-uuid'));

    await act(async () => {
        result.current.handleExperimentFileDelete('');
    });

    expect(toast.error).toHaveBeenCalledWith(
        'Invalid file name: ""',
        {
            id: 'invalid_file_name',
        }
    );
    expect(fetch).not.toHaveBeenCalled();
});
