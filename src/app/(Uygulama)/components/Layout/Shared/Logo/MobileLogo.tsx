import { FC } from "react";
import { useSelector } from "@/store/hooks";
import Link from "next/link";
import { styled } from "@mui/material/styles";
import { AppState } from "@/store/store";
import Image from "next/image";

const MobileLogo = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    overflow: "hidden",
    display: "block",
  }));

  if (customizer.activeDir === "ltr") {
    return (
      <LinkStyled href="/">
        {customizer.activeMode === "dark" ? (
          <Image
            src="/images/profile/logobeyaz.jpg"
            alt="logo"
            height={customizer.TopbarHeight}
            width={188}
            style={{ padding: "8px 4px", height: "auto" }}
            priority
          />
        ) : (
          <Image
            src={"/images/profile/logosiyah.jpg"}
            alt="logo"
            height={customizer.TopbarHeight}
            width={188}
            style={{ padding: "8px 4px", height: "auto" }}
            priority
          />
        )}
      </LinkStyled>
    );
  }

  return (
    <LinkStyled href="/">
      {customizer.activeMode === "dark" ? (
        <Image
          src="/images/profile/logobeyaz.jpg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={188}
          style={{ padding: "8px 8px", height: "auto" }}
          priority
        />
      ) : (
        <Image
          src="/images/profile/logosiyah.jpg"
          alt="logo"
          height={customizer.TopbarHeight}
          width={188}
          style={{ padding: "8px 8px", height: "auto" }}
          priority
        />
      )}
    </LinkStyled>
  );
};

export default MobileLogo;
