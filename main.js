const buku = [];
const HamburgerNavigation = document.getElementsByClassName('hamburger-toggle')[0]
const LinkSearch = document.getElementsByClassName('search-section')[0]
const event_render  = "render-book";
const key_storage = "Bookshelf";
const form = document.getElementById("inputBuku");
const inputCariBuku = document.getElementById("CariJudul");
const formCariBuku = document.getElementById("Cari-Buku");

/*menampilkan menu navigasi dari  icon hamburger*/
HamburgerNavigation.addEventListener('click', ()=>{
   LinkSearch.classList.toggle('active')
})

// cek support webstorage pada browser
function isStorageExist() {
   if (typeof Storage === "undefined") {
      swal( "Browser anda tidak mendukung web storage");
      return false;
   }
   return true;
}

// munculkan id buku
const munculkanId = () => +new Date();

// munculkan objek buku
const munculkanItemBuku = (id, judul, penulis, tahunterbit, isFinished) => {
   return {
      id,judul, penulis, tahunterbit, isFinished,
   };
};

// memeriksa status buku
function PeriksaStatusBuku() {
   const isCheckComplete = document.getElementById("input-buku-selesai");
   if (isCheckComplete.checked) {
      return true;
   }
   return false;
}

// menambah buku pada rakbuku
function tambahBuku() {
   const JudulBuku = document.getElementById("input-judul-buku").value;
   const Penulisbuku = document.getElementById("input-penulis").value;
   const TahunTerbit = document.getElementById("input-tahun").value;
   const isFinished = PeriksaStatusBuku();
   const id = munculkanId();
   const BukuBaru = munculkanItemBuku(id, JudulBuku, Penulisbuku, TahunTerbit, isFinished);

   buku.unshift(BukuBaru);
   document.dispatchEvent(new Event(event_render));
   SimpanData();

   swal("Buku berhasil ditambahkan");
}

// menemukan indeks buku menggunakan id buku
function TemukanIndeksBuku(bookId) {
   for (const index in buku) {
      if (buku[index].id == bookId) {
         return index;
      }
   }
   return null;
}



// menghapus buku
function HapusBuku(bookId) {
   const BukuTarget = TemukanIndeksBuku(bookId);
   swal({
      title: "Hapus Buku",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         buku.splice(BukuTarget, 1);
         document.dispatchEvent(new Event(event_render));
         SimpanData();

         swal("Buku berhasil dihapus");
      } else {
         swal("Buku batal dihapus");
      }
   });
}

// reset rak buku
function resetRak() {
   swal({
      title: "Reset Rak?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
   }).then((willDelete) => {
      if (willDelete) {
         buku.splice(0, buku.length);
         document.dispatchEvent(new Event(event_render));
         SimpanData();
         swal("Rak berhasil direset");
      } else {
         swal("Rak batal direset");
      }
   });
}

//mengubah status buku menjadi selesai dibaca atau belum selesai dibaca
function UbahStatusBuku(bookId) {
   const bookIndex = TemukanIndeksBuku(bookId);
   for (const index in buku) {
      if (index === bookIndex) {
         if (buku[index].isFinished === true) {
            buku[index].isFinished = false;
         } else {
            buku[index].isFinished = true;
         }
      }
   }
   document.dispatchEvent(new Event(event_render));
   SimpanData();
}

// mencegah request dari user saat mengklik elemen 
inputCariBuku.addEventListener("keyup", (event) => {
   event.preventDefault();
   CariBuku();
});

formCariBuku.addEventListener("submit", (event) => {
   event.preventDefault();
   CariBuku();
});

// fungsi caribuku
function CariBuku() {
   const InputJudul = document.getElementById("CariJudul").value.toLowerCase();
   const RakBukuBelumKelar = document.getElementById("rak-buku-belum");
   const RakBukuKelar = document.getElementById("rak-buku-selesai");
   RakBukuBelumKelar.innerHTML = "";
   RakBukuKelar.innerHTML = "";

   if (InputJudul == "") {
      document.dispatchEvent(new Event(event_render));
      return;
   }

   for (const book of buku) {
      if (book.judul.toLowerCase().includes(InputJudul)) {
         if (book.isFinished == false) {
            let el = `
            <article class="item_buku">
               <h3>${book.judul}</h3>
               <p>Penulis : ${book.penulis}</p>
               <p>Tahun Terbit : ${book.tahunterbit}</p>

               <div class="action">
                  <button class="btn-green" onclick="UbahStatusBuku(${book.id})">Selesai di Baca</button>
                  <button class="btn-red" onclick="HapusBuku(${book.id})">Hapus Buku</button>
                  <button class="btn-orange" onclick="EditDataBuku(${book.id})">Edit buku</button>
                  </div>
            </article>`;
            RakBukuBelumKelar.innerHTML += el;
         } else {
            let el = `
            <article class="item_buku">
               <h3>${book.judul}</h3>
               <p>Penulis : ${book.penulis}</p>
               <p>Tahun Terbit : ${book.tahunterbit}</p>
               <div class="action">
                  <button class="btn-green" onclick="UbahStatusBuku(${book.id})">Belum selesai di Baca</button>
                  <button class="btn-red" onclick="HapusBuku(${book.id})">Hapus Buku</button>
                  <button class="btn-orange" onclick="EditDataBuku(${book.id})">Edit buku</button>
                  </div>
            </article> `;
            RakBukuKelar.innerHTML += el;
         }
      }
   }
}

// fungsi edit data buku
function EditDataBuku(bookId) {
   const EditInput = document.querySelector(".input-edit");
   EditInput.style.display = "flex";
   const EditJudul = document.getElementById("editjudul");
   const EditPenulis = document.getElementById("editpenulis");
   const EditTahun = document.getElementById("edittahun");
   const InputEditData = document.getElementById("editData");
   const BatalEdit = document.getElementById("bataledit");
   const SubmitEdit = document.getElementById("bataleditsubmit");
   BukuTarget = TemukanIndeksBuku(bookId);

   //data lama
   EditJudul.setAttribute("value", buku[BukuTarget].judul);
   EditPenulis.setAttribute("value", buku[BukuTarget].penulis);
   EditTahun.setAttribute("value", buku[BukuTarget].tahunterbit);

   //ubah data
   SubmitEdit.addEventListener("click", (event) => {
      buku[BukuTarget].judul = EditJudul.value;
      buku[BukuTarget].penulis = EditPenulis.value;
      buku[BukuTarget].tahunterbit = EditTahun.value;

      document.dispatchEvent(new Event(event_render));
      SimpanData();
      InputEditData.reset();
      EditInput.style.display = "none";
   });

   BatalEdit.addEventListener("click", (event) => {
      event.preventDefault();
      EditInput.style.display = "none";
      InputEditData.reset();
   });
}

// menyimpan data ke penyimpanan lokal
function SimpanData() {
   if (isStorageExist()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(key_storage, parsed);
      document.dispatchEvent(new Event(event_render));
   }
}

// mengambil data dari penyimpanan
function AmbilDataStorage() {
   const serializedData = localStorage.getItem(key_storage);
   let data = JSON.parse(serializedData);

   if (data !== null) {
      data.forEach((book) => {
         buku.unshift(book);
      });
   }
   document.dispatchEvent(new Event(event_render));
   return buku;
}

// Memunculkan data buku pada rak
function MunculkanBuku(buku = []) {
   const RakBukuBelumKelar = document.getElementById("rak-buku-belum");
   const RakBukuKelar = document.getElementById("rak-buku-selesai");
   RakBukuBelumKelar.innerHTML = "";
   RakBukuKelar.innerHTML = "";

   buku.forEach((book) => {
      if (book.isFinished == false) {
         let el = `
            <article class="item_buku">
               <h3>${book.judul}</h3>
               <p>Penulis : ${book.penulis}</p>
               <p>Tahun Terbit : ${book.tahunterbit}</p>

               <div class="action">
                  <button class="btn-green" onclick="UbahStatusBuku(${book.id})">Ubah Status</button>
                  <button class="btn-red" onclick="HapusBuku(${book.id})">Hapus</button>
                  <button class="btn-orange" onclick="EditDataBuku(${book.id})">Edit</button>
               </div>
            </article>`;
         RakBukuBelumKelar.innerHTML += el;
      } else {
         let el = `
            <article class="item_buku">
               <h3>${book.judul}</h3>
               <p>Penulis : ${book.penulis}</p>
               <p>Tahun Terbit : ${book.tahunterbit}</p>

               <div class="action">
                  <button class="btn-green" onclick="UbahStatusBuku(${book.id})">Ubah Status</button>
                  <button class="btn-red" onclick="HapusBuku(${book.id})">Hapus</button>
                  <button class="btn-orange" onclick="EditDataBuku(${book.id})">Edit</button>
                  </div>
            </article>`; 
         RakBukuKelar.innerHTML += el;
      }
   });
}

// mengambil konten dan submit form
document.addEventListener("DOMContentLoaded", function () {
   form.addEventListener("submit", function (e) {
      e.preventDefault();
      tambahBuku();
      form.reset();
   });

   if (isStorageExist()) {
      AmbilDataStorage();
   }
});

// render event addeventlistener
document.addEventListener(event_render, () => {
   const ResetRak = document.getElementById("resetRak");
   if (buku.length <= 0) {
      ResetRak.style.display = "none";
   } else {
      ResetRak.style.display = "block";
   }

   MunculkanBuku(buku);
});
