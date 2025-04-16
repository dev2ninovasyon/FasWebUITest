"use client";

import PageContainer from "@/app/(Uygulama)/components/Container/PageContainer";
import Breadcrumb from "@/app/(Uygulama)/components/Layout/Shared/Breadcrumb/Breadcrumb";
import React from "react";
import { Grid, useTheme } from "@mui/material";
import { AppState } from "@/store/store";
import { useSelector } from "react-redux";

const BCrumb = [
  {
    to: "/Enflasyon",
    title: "Enflasyon",
  },
  {
    to: "/Enflasyon/Asamalar",
    title: "Aşamalar",
  },
];

const Page: React.FC = () => {
  const user = useSelector((state: AppState) => state.userReducer);
  const customizer = useSelector((state: AppState) => state.customizer);
  const theme = useTheme();

  return (
    <PageContainer title="Aşamalar" description="this is Aşamalar">
      <Breadcrumb title="Aşamalar" items={BCrumb} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} lg={12}>
          <iframe
            src={`https://localhost:44373//EnflasyonDuzeltmesi/Index?username=Cüneyt&denetciId=13&kullaniciId=48&denetlenenId=1379&yil=2023`}
            style={{
              border: "0px",
              width: "100%",
              height: 700,
            }}
          ></iframe>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Page;
