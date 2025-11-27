-- This is an empty migration.
CREATE UNIQUE INDEX one_root_only ON "Admin"(role) WHERE role = 'ROOT';
--INSERT INTO "Admin" (name, email, password, role)
--VALUES ('Root User', 'root@example.com', 'hashed_password', 'ROOT');