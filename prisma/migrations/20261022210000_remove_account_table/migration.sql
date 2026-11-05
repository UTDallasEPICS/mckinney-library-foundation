-- Better Auth only uses email OTP, which never reads or writes the account table
DROP TABLE "account";
