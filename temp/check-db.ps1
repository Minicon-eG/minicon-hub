docker run -v /opt/dorfkiste/data:/data alpine sh -c "apk add sqlite3 && sqlite3 /data/dorfkiste.db 'SELECT COUNT(*) FROM OfferPictures;'"
