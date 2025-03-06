// const url = process.env.NEXT_PUBLIC_BASE_URL;

// export const getAllJobs = async (accessToken: string | undefined) => {
//     const res = await fetch(`${url}opportunities/search`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         authorization: `Bearer ${accessToken}`,
//       },
//     });
//     const data = await res.json();
//     // console.log("datas from the api response **************************", data);
//     return data;
//   };