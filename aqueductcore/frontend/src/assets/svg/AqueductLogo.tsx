import { useTheme } from "@mui/material";

// fun fact: `viewBox` has always been camel-cased.
export const AqueductLogo = () => {
  const theme = useTheme();
  const fill = theme.palette.mode === "dark" ? "#FFFFFF" : "#000105";
  return (
    <svg width="120" height="114" viewBox="0 0 120 114" fill="none" xmlns="http://www.w3.org/2000/svg">
      <title>aqueduct logo</title>
      <path fillRule="evenodd" clipRule="evenodd" d="M-0.0176697 27.9843V0H15.5972V6.55446H6.83891V27.9843H-0.0176697Z" fill={fill} />
      <path fillRule="evenodd" clipRule="evenodd" d="M120 86.0333V114.018H104.385V107.463H113.143V86.0333H120Z" fill={fill} />
    </svg>

  );
};
