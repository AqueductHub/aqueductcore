import AqueductLogoLight from 'assets/images/AqueductLogoLight.png'
import AqueductLogoDark from 'assets/images/AqueductLogoDark.png'
import { ThemeModeTypes } from "types/componentTypes";

const logoWidth = 180;

export const AqueductLogo = ({ theme }: { theme?: ThemeModeTypes }) => {
    return (
        <img width={logoWidth} src={theme === 'dark' ? AqueductLogoDark : AqueductLogoLight} />
    );
};
