-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."ThemeName" ADD VALUE 'EXECUTIVE';
ALTER TYPE "public"."ThemeName" ADD VALUE 'STUDIO';
ALTER TYPE "public"."ThemeName" ADD VALUE 'SUNRISE';
ALTER TYPE "public"."ThemeName" ADD VALUE 'COASTAL';
ALTER TYPE "public"."ThemeName" ADD VALUE 'MIDNIGHT';
ALTER TYPE "public"."ThemeName" ADD VALUE 'ABYSS';
ALTER TYPE "public"."ThemeName" ADD VALUE 'NOIR';
ALTER TYPE "public"."ThemeName" ADD VALUE 'TERMINAL';
