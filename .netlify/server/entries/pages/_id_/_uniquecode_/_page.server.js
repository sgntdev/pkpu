import { E as EMAIL_1, a as EMAIL_2 } from "../../../../chunks/private.js";
function load({ params }) {
  const { id, uniquecode } = params;
  const defaultData = [
    {
      email: EMAIL_1,
      uniquecode: "fd82ja73h214db33",
      role: "admin"
    },
    {
      email: EMAIL_2,
      uniquecode: "k8d1d21hen1w43d",
      role: "user"
    }
  ];
  const user = defaultData.find((item) => item.uniquecode === uniquecode);
  if (user) {
    return {
      status: 200,
      body: {
        role: user.role,
        uniquecode
      }
    };
  } else {
    return {
      status: 400,
      body: {
        error: "Invalid uniquecode"
      }
    };
  }
}
export {
  load
};
