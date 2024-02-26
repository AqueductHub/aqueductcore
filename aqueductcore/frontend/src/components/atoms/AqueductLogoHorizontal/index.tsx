import AqueductLogoHorizontalLight from 'assets/images/AqueductLogoHorizontalLight.png';
import AqueductLogoHorizontalDark from 'assets/images/AqueductLogoHorizontalDark.png';
import { ThemeModeTypes } from "types/componentTypes";

const logoWidth = 210;

export const AqueductLogoHorinzontal = ({ theme }: { theme?: ThemeModeTypes }) => {
    return (
        <img width={logoWidth} src={theme === 'dark' ? AqueductLogoHorizontalDark : AqueductLogoHorizontalLight} title='aqueduct-logo' />
    );
};
