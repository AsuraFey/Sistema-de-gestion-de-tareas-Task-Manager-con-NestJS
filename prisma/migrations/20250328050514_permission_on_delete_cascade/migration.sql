-- DropForeignKey
ALTER TABLE "Permission" DROP CONSTRAINT "Permission_roleId_fkey";

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
