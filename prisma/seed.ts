import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {

  await prisma.blogiteksti.createMany({
    data : [
        {otsikko : "Norjan kauneus lumoaa", sisalto : "Aloitimme kesälomamme tekemällä Roadtripin Norjan Lofooteille. Reissu oli kaikinpuolin onnistunut ja viettämämme neljä päivää menivät hujauksessa ihastellessa Norjan maisemia.", kuva: "norja", kayttajaId : 1, kayttaja : "Mari", tykkaykset : 0, eiTykkaykset : 0, julkaistu : true},
        {otsikko : "Mökkimaisemia", sisalto : "Norjan reissun jälkeen suuntasimme perheen kesken mökille. On kyllä ollut täydelliset lomaviikot meidän perheellä!", kuva: "poika", kayttajaId : 1, kayttaja : "Mari", tykkaykset : 0, eiTykkaykset : 0, julkaistu : true},
        {otsikko : "Kotiseutu", sisalto : "Kesän lopussa suuntasimme maalaismaisemiin kotiseudulleni. Kuvassa oleva järvi on lapsuuden maisemia.", kuva: "järvi", kayttajaId : 2, kayttaja: "Hessu", tykkaykset : 0, eiTykkaykset : 0, julkaistu : true},

    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })