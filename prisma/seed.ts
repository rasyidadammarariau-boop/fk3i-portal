import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    const password = await hash('admin123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@fk3i.org' },
        update: {},
        create: {
            email: 'admin@fk3i.org',
            name: 'Admin FK3i',
            password,
            role: 'admin',
        },
    })
    console.log({ user })

    // Dummy News Data
    const newsData = [
        {
            title: "Muktamar Kyai Kampung Ke-5: Meneguhkan Peran Pesantren dalam Menjaga NKRI",
            slug: "muktamar-kyai-kampung-ke-5",
            content: "Forum Kyai Kampung Indonesia (FK3i) sukses menggelar Muktamar ke-5 yang dihadiri oleh ribuan kyai dari berbagai pelosok nusantara. Acara yang berlangsung khidmat ini menghasilkan beberapa rekomendasi penting terkait peran strategis pesantren dalam menjaga keutuhan Negara Kesatuan Republik Indonesia (NKRI) di tengah arus globalisasi dan radikalisme.\n\nKetua Umum FK3i dalam sambutannya menegaskan bahwa kyai kampung adalah benteng terakhir pertahanan moral bangsa. 'Kita mungkin tidak terlihat di panggung nasional setiap hari, tapi denyut nadi keagamaan masyarakat ada di tangan kita,' ujarnya disambut tepuk tangan riuh para hadirin.\n\nSelain membahas isu kebangsaan, muktamar juga menyoroti pentingnya kemandirian ekonomi pesantren. Beberapa model pemberdayaan ekonomi berbasis komunitas diperkenalkan sebagai solusi untuk menguatkan kemandirian umat.",
            image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop",
            published: true,
        },
        {
            title: "Gerakan Subuh Berjamaah: Menguatkan Spiritual, Merekatkan Sosial",
            slug: "gerakan-subuh-berjamaah",
            content: "FK3i meluncurkan program nasional 'Gerakan Subuh Berjamaah' yang serentak dilaksanakan di 34 provinsi. Gerakan ini bukan sekadar ritual ibadah, melainkan upaya untuk merekatkan kembali ikatan sosial masyarakat yang kian renggang.\n\nDi berbagai daerah, antusiasme masyarakat sangat tinggi. Masjid-masjid di kampung yang biasanya sepi saat subuh, kini mulai ramai oleh jamaah dari berbagai kalangan usia. Setelah sholat, kegiatan dilanjutkan dengan kuliah tujuh menit (kultum) dan sarapan bersama ala kadarnya, menciptakan suasana kehangatan dan kebersamaan.",
            image: "https://images.unsplash.com/photo-1564121211835-e88c852648ab?q=80&w=2070&auto=format&fit=crop",
            published: true,
        },
        {
            title: "Pelatihan Digital untuk Dai Muda: Berdakwah di Era Milenial",
            slug: "pelatihan-digital-dai-muda",
            content: "Menyadari pentingnya adaptasi teknologi, FK3i mengadakan pelatihan literasi digital bagi para dai muda. Tujuannya adalah untuk mengisi ruang-ruang media sosial dengan konten dakwah yang sejuk, moderat, dan mencerahkan.\n\n'Jihad kita hari ini bukan angkat senjata, tapi angkat smartphone untuk menyebarkan kebaikan,' ujar salah satu pemateri. Para peserta diajarkan teknik pembuatan konten video pendek, desain grafis dasar, dan etika bermedia sosial.",
            image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop",
            published: true,
        },
        {
            title: "Bantuan Kemanusiaan untuk Korban Bencana Alam",
            slug: "bantuan-kemanusiaan-bencana",
            content: "Merespons bencana banjir yang melanda beberapa wilayah, Tim Reaksi Cepat FK3i langsung turun ke lapangan untuk menyalurkan bantuan logistik dan memberikan dukungan psikososial kepada para korban.\n\nBantuan berupa sembako, pakaian layak pakai, dan obat-obatan didistribusikan langsung ke posko-posko pengungsian. FK3i juga mengerahkan relawan santri untuk membantu membersihkan fasilitas umum pasca banjir.",
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop",
            published: true,
        },
        {
            title: "Silaturahmi Kebangsaan: Merawat Kebhinekaan",
            slug: "silaturahmi-kebangsaan",
            content: "Dalam rangka memperingati Hari Kemerdekaan, FK3i menggelar dialog lintas agama dan budaya bertajuk 'Silaturahmi Kebangsaan'. Acara ini bertujuan untuk memperkuat tali persaudaraan sesama anak bangsa tanpa memandang suku, agama, dan ras.",
            image: "https://images.unsplash.com/photo-1529070538774-1843cb6e65b3?q=80&w=2070&auto=format&fit=crop",
            published: true,
        }
    ]

    for (const news of newsData) {
        await prisma.news.upsert({
            where: { slug: news.slug },
            update: {},
            create: news,
        })
    }
    console.log("Seeded News Data")

    // Dummy Gallery Data
    const galleryData = [
        {
            title: "Pengajian Akbar Bulanan",
            slug: "pengajian-akbar-bulanan",
            description: "Ribuan jamaah memadati alun-alun kota untuk mengikuti pengajian akbar.",
            cover: "https://images.unsplash.com/photo-1609520778163-a16fb37d663d?q=80&w=2070&auto=format&fit=crop",
            eventDate: new Date('2026-01-15'),
        },
        {
            title: "Santunan Anak Yatim",
            slug: "santunan-anak-yatim",
            description: "Pembagian santunan rutin kepada anak yatim piatu di lingkungan sekitar.",
            cover: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop",
            eventDate: new Date('2026-01-20'),
        },
        {
            title: "Gotong Royong Pembangunan Masjid",
            slug: "gotong-royong-pembangunan-masjid",
            description: "Warga dan santri bahu-membahu dalam proses pengecoran dak masjid.",
            cover: "https://images.unsplash.com/photo-1588611910672-8789366113b2?q=80&w=2070&auto=format&fit=crop",
            eventDate: new Date('2026-01-10'),
        },
        {
            title: "Rapat Koordinasi Wilayah",
            slug: "rapat-koordinasi-wilayah",
            description: "Pengurus wilayah FK3i sedang membahas program kerja tahunan.",
            cover: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=2032&auto=format&fit=crop",
            eventDate: new Date('2026-01-05'),
        },
        {
            title: "Festival Hadroh Nusantara",
            slug: "festival-hadroh-nusantara",
            description: "Penampilan grup hadroh santri dalam rangka memeriahkan hari santri.",
            cover: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop",
            eventDate: new Date('2025-12-28'),
        },
        {
            title: "Panen Raya Pesantren",
            slug: "panen-raya-pesantren",
            description: "Hasil bumi dari lahan pertanian yang dikelola oleh koperasi pesantren.",
            cover: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070&auto=format&fit=crop",
            eventDate: new Date('2025-12-20'),
        }
    ]

    for (const item of galleryData) {
        await prisma.galleryAlbum.upsert({
            where: { slug: item.slug },
            update: {},
            create: item
        })
    }
    console.log("Seeded Gallery Data")

    // Dummy Agenda Data
    const agendaData = [
        {
            title: "Musyawarah Kerja Wilayah Jawa Tengah",
            slug: "muskerwil-jateng-2026",
            description: "Forum strategis untuk merumuskan program kerja tahunan FK3i wilayah Jawa Tengah, dihadiri oleh perwakilan dari 35 kabupaten/kota.",
            date: new Date('2026-02-12'),
            location: "Pesantren Al-Hikmah, Semarang"
        },
        {
            title: "Pelatihan Digital Marketing Santri",
            slug: "pelatihan-digital-santri",
            description: "Workshop intensif selama 3 hari untuk membekali santri dengan kemampuan pemasaran digital dan kewirausahaan online.",
            date: new Date('2026-02-25'),
            location: "Aula FK3i Pusat, Jakarta"
        },
        {
            title: "Pengajian Akbar Menyambut Ramadhan",
            slug: "pengajian-akbar-ramadhan-1447",
            description: "Tabligh akbar dalam rangka tarhib Ramadhan, mengundang penceramah nasional dan dimeriahkan oleh grup sholawat ternama.",
            date: new Date('2026-03-10'),
            location: "Masjid Agung Surabaya"
        },
    ]

    for (const item of agendaData) {
        await prisma.agenda.upsert({
            where: { slug: item.slug },
            update: {},
            create: item
        })
    }
    console.log("Seeded Agenda Data")

    // Seed Message Categories
    const categories = [
        {
            name: "Undangan Kegiatan / Ceramah",
            slug: "undangan",
            description: "Undangan untuk mengisi ceramah, tabligh, atau kegiatan keagamaan",
            icon: "Calendar",
            order: 1
        },
        {
            name: "Usulan Kerjasama",
            slug: "kerjasama",
            description: "Proposal kerjasama program atau kegiatan",
            icon: "Handshake",
            order: 2
        },
        {
            name: "Aspirasi / Masukan",
            slug: "aspirasi",
            description: "Saran, kritik, atau masukan untuk organisasi",
            icon: "MessageSquare",
            order: 3
        },
        {
            name: "Lainnya",
            slug: "lainnya",
            description: "Pertanyaan atau keperluan lainnya",
            icon: "HelpCircle",
            order: 4
        }
    ]

    for (const cat of categories) {
        await prisma.messageCategory.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat
        })
    }
    console.log("Seeded Message Categories")

    // Seed Organization Profile
    await prisma.organizationProfile.upsert({
        where: { id: "default" },
        update: {},
        create: {
            id: "default",
            email: "sekretariat@fk3i.or.id",
            emailSecondary: "humas@fk3i.or.id",
            phone: "+62 21 1234 5678",
            whatsapp: "6281234567890",
            whatsappSecondary: "6285678901234",
            address: "Jl. Kramat Raya No. 164",
            city: "Jakarta Pusat",
            province: "DKI Jakarta",
            postalCode: "10430",
            facebook: "https://facebook.com/fk3i",
            instagram: "https://instagram.com/fk3i",
            twitter: "https://twitter.com/fk3i",
            youtube: "https://youtube.com/@fk3i",
            shortDescription: "Wadah silaturahmi kyai kampung yang bergerak dalam penguatan dakwah, pendidikan, dan ekonomi umat di akar rumput.",
            longDescription: "Forum Kyai Kampung Indonesia (FK3i) adalah organisasi yang menghimpun para kyai dan ulama di tingkat kampung/desa untuk bersama-sama mengembangkan dakwah Islam yang moderat, menjaga tradisi Ahlussunnah wal Jamaah, serta memberdayakan ekonomi umat.",
            vision: "Menjadi lokomotif pergerakan kyai kampung dalam mewujudkan tatanan masyarakat yang religius, moderat, dan sejahtera dalam bingkai NKRI.",
            mission: "1. Melestarikan ajaran Islam Ahlussunnah wal Jamaah An-Nahdliyah dan kearifan lokal\n2. Mengukuhkan komitmen kebangsaan dan cinta tanah air sebagai bagian dari iman\n3. Membangun kemandirian ekonomi kyai dan pesantren melalui kewirausahaan sosial",
            history: "Bermula dari kegelisahan para kyai di pelosok desa yang merasakan perlunya wadah komunikasi untuk merespons tantangan zaman, Forum Kyai Kampung Indonesia lahir. Bukan dari istana, melainkan dari surau-surau kecil yang tak pernah lelah mengumandangkan adzan dan mengajarkan alif-ba-ta. Kini, FK3i telah tumbuh menjadi kekuatan moral yang diperhitungkan, dengan ribuan anggota yang tersebar di seluruh provinsi, terus berkhidmat tanpa pamrih untuk agama dan bangsa."
        }
    })
    console.log("Seeded Organization Profile")
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
