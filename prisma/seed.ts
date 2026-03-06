import "dotenv/config"
import { hash } from 'bcryptjs'
import prisma from '../lib/prisma'

async function main() {
    // === Hapus Data Lama Terlebih Dahulu ===
    console.log("Menghapus data lama FK3I...")
    await prisma.orgDocument.deleteMany()
    await prisma.messageCategory.deleteMany()
    await prisma.galleryImage.deleteMany()
    await prisma.galleryAlbum.deleteMany()
    await prisma.news.deleteMany()
    await prisma.organizationProfile.deleteMany()
    console.log("Data lama berhasil dihapus.")

    // 1. User Account
    const password = await hash('admin123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@bempesantren.org' },
        update: {},
        create: {
            email: 'admin@bempesantren.org',
            name: 'Pusat BEM Pesantren',
            password,
            role: 'admin',
        },
    })
    console.log({ user })

    // 2. News Data
    const newsData = [
        {
            title: "Masa Ta'aruf Mahasiswa Santri Nasional 2026 Sukses Digelar",
            slug: "mastama-nasional-2026",
            content: "Ribuan mahasiswa santri dari berbagai pondok pesantren dan perguruan tinggi di Indonesia mengikuti agenda Masa Ta'aruf Mahasiswa (Mastama) Tingkat Nasional secara hibrida. Acara ini bertujuan mengokohkan ukhuwah islamiyah, wathoniyah, dan basyariyah di kalangan pemuda pencari ilmu.",
            image: "https://images.unsplash.com/photo-1519791883288-dc8bd696e667?q=80&w=2070&auto=format&fit=crop",
            published: true,
            views: 450
        },
        {
            title: "Simposium Ekonomi Syariah BEM Pesantren Tingkat Nasional",
            slug: "simposium-ekonomi-syariah",
            content: "Dalam upaya mendorong kemandirian ekonomi pesantren, BEM Pesantren menggelar simposium yang mendiskusikan peta jalan pengembangan ekonomi syariah dan kewirausahaan di kalangan mahasiswa santri. Acara ini juga melahirkan berbagai Memorandum of Understanding dengan industri kreatif islami.",
            image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2113&auto=format&fit=crop",
            published: true,
            views: 310
        },
        {
            title: "Pesantren Ramah Anak: BEM Pesantren Turun Gelar Sosialisasi",
            slug: "pesantren-ramah-anak-sosialisasi",
            content: "Untuk menyikapi isu kekerasan di ruang lingkup pendidikan, para kader BEM Pesantren serentak menyebarkan modul dan pendekatan pesantres ramah anak yang menitikberatkan pada kurikulum berbasis akhlakul karimah dan perlindungan komprehensif.",
            image: "https://images.unsplash.com/photo-1596767784607-e836bfaea102?q=80&w=2070&auto=format&fit=crop",
            published: true,
            views: 520
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

    // 3. Gallery / Arsip Pergerakan Data
    const galleryData = [
        {
            title: "Pelantikan Pengurus Pusat BEM Pesantren Nusantara",
            slug: "pelantikan-pengurus-2026",
            description: "Prosesi sakral pelantikan pengurus pusat periode 2026 di Jakarta.",
            cover: "https://images.unsplash.com/photo-1588636402447-fd150b4ec2b5?q=80&w=2070&auto=format&fit=crop",
            eventDate: new Date('2026-01-10'),
            activityType: "silatnas"
        },
        {
            title: "Aksi Solidaritas Kemanusiaan Global",
            slug: "aksi-solidaritas-kemanusiaan",
            description: "Aksi damai oleh gabungan BEM Pesantren menyerukan kebebasan dan keadilan hak asasi manusia.",
            cover: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2084&auto=format&fit=crop",
            eventDate: new Date('2025-11-20'),
            activityType: "aksi"
        },
        {
            title: "Audiensi Modul Kurikulum Merdeka di Kemenag",
            slug: "audiensi-kurikulum-kemenag",
            description: "Tim Pendidikan & Riset BEM Pesantren menyerahkan telaah kritis terkait kurikulum agama kepada Dirjen Pendis.",
            cover: "https://images.unsplash.com/photo-1603513364956-6f116a4f7287?q=80&w=2071&auto=format&fit=crop",
            eventDate: new Date('2025-12-05'),
            activityType: "audiensi"
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

    // 4. Message Categories
    const categories = [
        {
            name: "Undangan Kegiatan / Tabligh",
            slug: "undangan-kegiatan",
            description: "Agenda majelis kehormatan, simposium, maupun undangan kemahasiswaan.",
            icon: "Calendar",
            order: 1
        },
        {
            name: "Laporan & Advokasi Kasus",
            slug: "laporan-advokasi",
            description: "Pengaduan diskriminasi atau kebutuhan pendampingan advokasi.",
            icon: "AlertTriangle",
            order: 2
        },
        {
            name: "Usulan Kerja Sama / Sponsor",
            slug: "usulan-kerjasama",
            description: "Tawaran kolaborasi program strategis CSR dari perusahaan atau lembaga.",
            icon: "Handshake",
            order: 3
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

    // 5. Repositori Dokumen
    const dokumenData = [
        {
            title: "AD/ART BEM Pesantren Indonesia",
            fileName: "AD_ART_BEM_PESANTREN.pdf",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            description: "Dokumen konstitusi dasar organisasi kemahasiswaan santri nasional.",
            category: "ad-art",
            published: true,
            uploadedBy: "Sekretaris Jenderal",
            downloadCount: 150
        },
        {
            title: "Garis Besar Haluan Organisasi (GBHO)",
            fileName: "GBHO_BEM_PESANTREN.pdf",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            description: "Peta jalan arah kebijakan organisasi tiga periode ke depan.",
            category: "gbho",
            published: true,
            uploadedBy: "Ketua BPO",
            downloadCount: 88
        },
        {
            title: "SOP Administrasi Kesekretariatan Nasional",
            fileName: "SOP_Administrasi.pdf",
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            description: "Standar operasional prosedur terkait administrasi surat menyurat, pengarsipan, dan tata kelola kantor.",
            category: "sop",
            published: true,
            uploadedBy: "Badan Administrasi",
            downloadCount: 75
        }
    ]

    for (const doc of dokumenData) {
        const existing = await prisma.orgDocument.findFirst({ where: { fileName: doc.fileName } })
        if (existing) {
            await prisma.orgDocument.update({ where: { id: existing.id }, data: doc })
        } else {
            await prisma.orgDocument.create({ data: doc })
        }
    }
    console.log("Seeded Org Documents")

    // 6. Organization Profile
    await prisma.organizationProfile.upsert({
        where: { id: "default" },
        update: {
            email: "pusat@bempesantren.org",
            emailSecondary: "humas@bempesantren.org",
            phone: "+62 811 1234 5678",
            whatsapp: "6281112345678",
            whatsappSecondary: "6285512345678",
            address: "Jl. Kyai Haji Wahid Hasyim No. 12, Menteng",
            city: "Jakarta Pusat",
            province: "DKI Jakarta",
            postalCode: "10340",
            facebook: "https://facebook.com/bempesantren_id",
            instagram: "https://instagram.com/bempesantren_id",
            twitter: "https://twitter.com/bempesantren",
            youtube: "https://youtube.com/@bempesantren_official",
            shortDescription: "Wadah perjuangan dan silaturahmi mahasiswa santri dari seluruh Indonesia guna mendorong terwujudnya intelektual muslim bermartabat.",
            longDescription: "BEM Pesantren Indonesia adalah aliansi strategis badan eksekutif mahasiswa yang memiliki kultur, nasab, maupun latar belakang pondok pesantren dari seluruh Indonesia. Fokus kami tidak hanya pada retorika politik kampus, melainkan memberdayakan santri di dunia perguruan tinggi untuk proaktif memajukan keilmuan dan sosial-kemasyarakatan, serta menghadirkan islam yang ramah sesuai ajaran ulama Nusantara.",
            vision: "Menjadi pelopor generasi muslim terpelajar yang moderat (wasathiyah), inovatif, dan berakhlak mulia untuk kemajuan esensi agama dan bangsa.",
            mission: "1. Menguatkan manifestasi dan ukhuwah antar BEM serta elemen santri se-Nusantara.\n2. Mewujudkan pemberdayaan akademik, pergerakan sosial, dan kemandirian ekonomi.\n3. Berperan aktif dan kritis dalam advokasi kebijakan publik yang mengedepankan maslahat kerakyatan.\n4. Merawat, mendongkrak, dan mengartikulasikan tradisi intelektual ulama salaf di ruang publik kebangsaan.",
            history: "Bermula dari kegelisahan beberapa aktivis mahasiswa lintas universitas akan minimnya sinergi mahasiswa berlatar belakang pesantren, diinisiasi musyawarah agung perdana pada era reformasi..."
        },
        create: {
            id: "default",
            email: "pusat@bempesantren.org",
            emailSecondary: "humas@bempesantren.org",
            phone: "+62 811 1234 5678",
            whatsapp: "6281112345678",
            whatsappSecondary: "6285512345678",
            address: "Jl. Kyai Haji Wahid Hasyim No. 12, Menteng",
            city: "Jakarta Pusat",
            province: "DKI Jakarta",
            postalCode: "10340",
            facebook: "https://facebook.com/bempesantren_id",
            instagram: "https://instagram.com/bempesantren_id",
            twitter: "https://twitter.com/bempesantren",
            youtube: "https://youtube.com/@bempesantren_official",
            shortDescription: "Wadah perjuangan dan silaturahmi mahasiswa santri dari seluruh Indonesia guna mendorong terwujudnya intelektual muslim bermartabat.",
            longDescription: "BEM Pesantren Indonesia adalah aliansi strategis badan eksekutif mahasiswa yang memiliki kultur, nasab, maupun latar belakang pondok pesantren dari seluruh Indonesia. Fokus kami tidak hanya pada retorika politik kampus, melainkan memberdayakan santri di dunia perguruan tinggi untuk proaktif memajukan keilmuan dan sosial-kemasyarakatan, serta menghadirkan islam yang ramah sesuai ajaran ulama Nusantara.",
            vision: "Menjadi pelopor generasi muslim terpelajar yang moderat (wasathiyah), inovatif, dan berakhlak mulia untuk kemajuan esensi agama dan bangsa.",
            mission: "1. Menguatkan manifestasi dan ukhuwah antar BEM serta elemen santri se-Nusantara.\n2. Mewujudkan pemberdayaan akademik, pergerakan sosial, dan kemandirian ekonomi.\n3. Berperan aktif dan kritis dalam advokasi kebijakan publik yang mengedepankan maslahat kerakyatan.\n4. Merawat, mendongkrak, dan mengartikulasikan tradisi intelektual ulama salaf di ruang publik kebangsaan.",
            history: "Bermula dari kegelisahan beberapa aktivis mahasiswa lintas universitas akan minimnya sinergi mahasiswa berlatar belakang pesantren, diinisiasi musyawarah agung perdana pada era reformasi..."
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
