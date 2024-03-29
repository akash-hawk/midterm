-- CreateTable
CREATE TABLE "discussions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "movie_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discussions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "discussions" ADD CONSTRAINT "discussions_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
