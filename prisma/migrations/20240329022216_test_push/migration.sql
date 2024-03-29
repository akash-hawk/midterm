-- CreateTable
CREATE TABLE "discussions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "movieId" TEXT NOT NULL,

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
