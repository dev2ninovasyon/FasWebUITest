"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Shared/Breadcrumb/Breadcrumb";
import { Box, Button, Grid, Typography } from "@mui/material";
import { AppState } from "@/store/store";
import { useSelector } from "@/store/hooks";
import { useState } from "react";
import { createCalismaKagidiVerisi } from "@/api/CalismaKagitlari/CalismaKagitlari";
import TarihliCalismaKagidiBelge from "@/app/(Uygulama)/components/CalismaKagitlari/TarihliCalismaKagidiBelge";
import { CreateGroupPopUp } from "../../components/CalismaKagitlari/CreateGroupPopUp";

const BCrumb = [
  {
    to: "/PlanVeProgram",
    title: "Plan ve Program",
  },
  {
    to: "/PlanVeProgram/DenetimTakvimi",
    title: "Denetim Takvimi",
  },
];

const Page = () => {
  const [islem, setIslem] = useState("");
  const [isCreatePopUpOpen, setIsCreatePopUpOpen] = useState(false);

  const [isClickedYeniGrupEkle, setIsClickedYeniGrupEkle] = useState(false);
  const [isClickedVarsayilanaDon, setIsClickedVarsayilanaDon] = useState(false);

  const [tamamlanan, setTamamlanan] = useState(0);
  const [toplam, setToplam] = useState(0);

  const user = useSelector((state: AppState) => state.userReducer);
  const controller = "DenetimTakvimi";
  const grupluMu = false;

  const handleOpen = () => {
    setIsCreatePopUpOpen(true);
    setIsClickedYeniGrupEkle(true);
  };

  const handleCreateGroup = async (calisma: string) => {
    const createdCalismaKagidiGrubu = {
      denetlenenId: user.denetlenenId,
      denetciId: user.denetciId,
      yil: user.yil,
      calisma: calisma,
    };

    try {
      const result = await createCalismaKagidiVerisi(
        controller || "",
        user.token || "",
        createdCalismaKagidiGrubu
      );
      if (result) {
        setIsCreatePopUpOpen(false);
        setIsClickedYeniGrupEkle(false);
      } else {
        console.error("Çalışma Kağıdı Verisi ekleme başarısız");
      }
    } catch (error) {
      console.error("Bir hata oluştu:", error);
    }
  };

  return (
    <>
      <Breadcrumb title="Denetim Takvimi" items={BCrumb}>
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
              md={grupluMu ? 2.8 : 3.8}
              lg={grupluMu ? 2.8 : 3.8}
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
            {grupluMu && (
              <Grid
                item
                xs={3.8}
                md={grupluMu ? 2.8 : 3.8}
                lg={grupluMu ? 2.8 : 3.8}
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
                  onClick={() => handleOpen()}
                  sx={{ width: "100%" }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      overflowWrap: "break-word",
                      wordWrap: "break-word",
                    }}
                  >
                    Yeni Grup Ekle
                  </Typography>{" "}
                </Button>
              </Grid>
            )}
            <Grid
              item
              xs={5.8}
              md={grupluMu ? 2.8 : 3.8}
              lg={grupluMu ? 2.8 : 3.8}
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
                sx={{ width: "100%" }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    overflowWrap: "break-word",
                    wordWrap: "break-word",
                  }}
                >
                  Ek Belge Yükle
                </Typography>
              </Button>
            </Grid>
            <Grid
              item
              xs={5.8}
              md={grupluMu ? 2.8 : 3.8}
              lg={grupluMu ? 2.8 : 3.8}
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
          {isCreatePopUpOpen && (
            <CreateGroupPopUp
              islem={islem}
              setIslem={setIslem}
              isPopUpOpen={isCreatePopUpOpen}
              setIsPopUpOpen={setIsCreatePopUpOpen}
              handleCreateGroup={handleCreateGroup}
            />
          )}
        </>
      </Breadcrumb>
      <PageContainer
        title="Denetim Takvimi"
        description="this is Denetim Takvimi"
      >
        <Box>
          <TarihliCalismaKagidiBelge
            controller={controller}
            grupluMu={grupluMu}
            isClickedYeniGrupEkle={isClickedYeniGrupEkle}
            isClickedVarsayilanaDon={isClickedVarsayilanaDon}
            setIsClickedVarsayilanaDon={setIsClickedVarsayilanaDon}
            setTamamlanan={setTamamlanan}
            setToplam={setToplam}
          />
        </Box>
      </PageContainer>
    </>
  );
};

export default Page;
