import { useTheme } from "@mui/material";

export const AqueductLogoSVG = () => {
  const theme = useTheme();
  // const fill = theme.palette.mode === "dark" ? "#FFFFFF" : "#000105";
  return (
    <svg width="125" height="125" viewBox="0 0 125 125" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_1_59)">
        <path d="M62.5 125C89.8869 125 105.112 125 115.056 115.056C125 105.113 125 89.8875 125 62.5C125 35.1125 125 19.8881 115.056 9.94375C105.112 0 89.8869 0 62.5 0C35.1131 0 19.8881 0 9.94375 9.94375C0 19.8881 0 35.1131 0 62.5C0 89.8869 0 105.112 9.94375 115.056C19.8875 125 35.1125 125 62.5 125Z" fill="#3CCBDA" />
        <path d="M60.3558 31.4775C46.624 31.4775 35.0777 40.8225 31.7215 53.4994H72.5415V76.9613H62.7008V63.8013H30.8608C32.2258 78.8957 44.9065 90.7244 60.3565 90.7244H89.9802V61.1007C89.9802 44.74 76.7165 31.4775 60.3565 31.4775" fill="#3D3D3B" />
      </g>
      <defs>
        <clipPath id="clip0_1_59">
          <rect width="125" height="125" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
