import { url } from "@/api/apiBase";

export const getMaddiDogrulama = async (
  token: string,
  tfrsmi?: boolean | null,
  bobimi?: boolean | null
) => {
  try {
    // Temel URL
    let query = `${url}/DenetimDosyaBelgeleri/MaddiDogrulamaListe?`;

    // tfrsmi ve bobimi değerlerini dinamik olarak ekliyoruz
    if (tfrsmi !== null && tfrsmi !== undefined) {
      query += `tfrsmi=${tfrsmi}&`;
    }
    if (bobimi !== null && bobimi !== undefined) {
      query += `bobimi=${bobimi}&`;
    }

    // Fazladan & karakterini kaldırıyoruz
    query = query.slice(0, -1);

    const response = await fetch(query, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return response.json();
    } else {
      console.error(" verileri getirilemedi");
      return null; // Hata durumunda null döndürüyoruz
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
    return null; // Hata durumunda null döndürüyoruz
  }
};

export const getUygulananDenetimProsedurleri = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number,
  dipnotAdi: string,
  tfrsmi: boolean
) => {
  try {
    const response = await fetch(
      `${url}/UygulananDenetimProsedurleri?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}&dipnotAdi=${dipnotAdi}&tfrsmi=${tfrsmi}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Çalışma kağıdı verileri getirilemedi");
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};
export const createCalismaKagidiVerisi = async (
  token: string,
  createdCalismaKagidiVerisi: any
) => {
  try {
    const response = await fetch(`${url}/UygulananDenetimProsedurleri`, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(createdCalismaKagidiVerisi),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const updateCalismaKagidiVerisi = async (
  token: string,
  id: any,
  updatedCalismaKagidiVerisi: any
) => {
  try {
    const response = await fetch(`${url}/UygulananDenetimProsedurleri/${id}`, {
      method: "PUT",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedCalismaKagidiVerisi),
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const deleteCalismaKagidiVerisiById = async (
  controller: string,
  token: string,
  id: any
) => {
  try {
    const response = await fetch(`${url}/UygulananDenetimProsedurleri/${id}`, {
      method: "DELETE",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};

export const deleteAllCalismaKagidiVerileri = async (
  token: string,
  denetciId: number,
  denetlenenId: number,
  yil: number,
  dipnotAdi: string,
  tfrsmi: boolean
) => {
  try {
    const response = await fetch(
      `${url}/UygulananDenetimProsedurleri?denetciId=${denetciId}&yil=${yil}&denetlenenId=${denetlenenId}&dipnotAdi=${dipnotAdi}&tfrsmi=${tfrsmi}`,
      {
        method: "DELETE",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Bir hata oluştu:", error);
  }
};
