export default function Users(db) {
  async function userSignup(userDetails) {
    let error;
    let { password, email, is_admin } = userDetails;
    const emailRegex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    // ensure user uses correct mail format
    if (emailRegex.test(email)) {
      let usercheck = await db.oneOrNone(
        `SELECT id FROM shoe_api_schema.users WHERE email= $1`,
        email
      );
      if (usercheck === null) {
        await db.none(
          "INSERT INTO shoe_api_schema.users (password,email,is_admin) values ($1,$2,$3)",
          [password, email, is_admin]
        );
      } else {
        error = "mail exist";
      }
    } else {
      error = "invalid mail format";
    }
    return error;
  }
  async function userLogin(userDetails) {
    const { email } = userDetails;
    try {
      return await db.oneOrNone(
        "SELECT * FROM shoe_api_schema.users WHERE email=$1",
        [email]
      );
    } catch (error) {
      console.log(error);
    }
  }
  return {
    userSignup,
    userLogin,
  };
}
