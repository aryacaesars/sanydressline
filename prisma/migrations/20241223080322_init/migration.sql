-- CreateTable
CREATE TABLE "Category" (
    "CategoryID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "Dress" (
    "DressID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT,
    "Price" DECIMAL(65,30) NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Status" TEXT NOT NULL,
    "OrderCount" INTEGER NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,
    "CategoryID" INTEGER NOT NULL,

    CONSTRAINT "Dress_pkey" PRIMARY KEY ("DressID")
);

-- CreateTable
CREATE TABLE "Image" (
    "ImageID" SERIAL NOT NULL,
    "DressID" INTEGER NOT NULL,
    "Url" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("ImageID")
);

-- CreateTable
CREATE TABLE "PageContent" (
    "ContentID" SERIAL NOT NULL,
    "PageName" TEXT NOT NULL,
    "Section" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PageContent_pkey" PRIMARY KEY ("ContentID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_Name_key" ON "Category"("Name");

-- AddForeignKey
ALTER TABLE "Dress" ADD CONSTRAINT "Dress_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_DressID_fkey" FOREIGN KEY ("DressID") REFERENCES "Dress"("DressID") ON DELETE RESTRICT ON UPDATE CASCADE;
