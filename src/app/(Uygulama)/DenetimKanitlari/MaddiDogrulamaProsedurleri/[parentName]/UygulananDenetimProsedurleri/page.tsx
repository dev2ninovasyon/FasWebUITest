"use client";
import UygulananDentimProsedurleri from "@/app/(Uygulama)/components/CalismaKagitlari/MaddiDogrulama/UygulananDenetimProsedurleri";
import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Shared/Breadcrumb/Breadcrumb";
import { Button, Grid, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const parentNameIndex = segments.indexOf("MaddiDogrulamaProsedurleri") + 1;
  const parentName = segments[parentNameIndex];
  const childName = segments[parentNameIndex + 1];

  const [isClickedVarsayilanaDon, setIsClickedVarsayilanaDon] = useState(false);

  const [dip, setDip] = useState("");
  const [tamamlanan, setTamamlanan] = useState(0);
  const [toplam, setToplam] = useState(0);

  const BCrumb = [
    {
      to: "/DenetimKanitlari",
      title: "Denetim Kanıtları",
    },
    {
      to: "/DenetimKanitlari/MaddiDogrulamaProsedurleri",
      title: "Maddi Doğrulama Prosedürleri",
    },
    {
      to: `/DenetimKanitlari/MaddiDogrulamaProsedurleri/${parentName}/${childName}`,
      title: `${dip}`,
    },
    {
      to: `/DenetimKanitlari/MaddiDogrulamaProsedurleri/${parentName}/${childName}`,
      title: "Uygulanan Denetim Prosedürleri",
    },
  ];

  return (
    <PageContainer
      title={`${dip} | Uygulanan Denetim Prosedürleri`}
      description="this is Uygulanan Denetim Prosedürleri"
    >
      <Breadcrumb
        title={"Uygulanan Denetim Prosedürleri"}
        subtitle={`${dip}`}
        items={BCrumb}
      >
        <>
          <Grid
            container
            sx={{
              width: "95%",
              height: "100%",
              margin: "0 auto",
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              xs={12}
              md={4.8}
              lg={4.8}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  overflowWrap: "break-word",
                  wordWrap: "break-word",
                  textAlign: "center",
                }}
              >
                {tamamlanan}/{toplam} Tamamlandı
              </Typography>
            </Grid>
            <Grid
              item
              xs={5.8}
              md={4.8}
              lg={4.8}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button
                size="medium"
                variant="outlined"
                color="primary"
                onClick={() => setIsClickedVarsayilanaDon(true)}
                sx={{ width: "100%" }}
              >
                <Typography
                  variant="body1"
                  sx={{ overflowWrap: "break-word", wordWrap: "break-word" }}
                >
                  Varsayılana Dön
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </>
      </Breadcrumb>
      <UygulananDentimProsedurleri
        controller="UygulananDentimProsedurleri"
        isClickedVarsayilanaDon={isClickedVarsayilanaDon}
        alanAdi1="Kategori"
        alanAdi2="Konu"
        alanAdi3="Açıklama"
        setIsClickedVarsayilanaDon={setIsClickedVarsayilanaDon}
        setTamamlanan={setTamamlanan}
        setToplam={setToplam}
        dipnotAdi={parentName} // dipnotAdi olarak dinamik parentId'yi gönderiyoruz
        setDip={setDip}
      />
    </PageContainer>
  );
};

export default Page;
