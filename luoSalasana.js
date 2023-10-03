let hash = require("crypto").createHash("SHA256").update("heissan").digest("hex");
console.log(hash);