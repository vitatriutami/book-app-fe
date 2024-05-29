import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Input } from "./components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "./components/ui/button";
import { bookServices } from "./services/bookServices";
import { toast } from "sonner";
import { IBook } from "./types/entity";

const initialBookVal: IBook = {
  name: "",
  description: "",
  isbn: "",
  author: "",
  file: null,
};

// const book = {
//   name: book.name,
//   description: book.description,
//   isbn: book.isbn,
//   author: book.author,
// };

export default function App() {
  const [book, setBook] = useState(initialBookVal);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["books"], // key untuk caching ke browser dengan nama/label apa, untuk invalidate (dihapus - dicache ulang)
    queryFn: bookServices.getData,
  });

  const { mutate: handleAddBook } = useMutation({
    mutationFn: bookServices.createData,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Buku berhasil ditambahkan");
      setBook(initialBookVal);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message);
    },
  });
  // async function createData() {
  //   const res = await fetch("http://localhost:8000/books", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(book),
  //   });
  //   const data = await res.json();
  //   console.log(data);
  //   getData();
  //   setBook(initialBookVal);
  // }

  // useEffect(() => {
  //   getData();
  // }, []);

  return (
    <div className="flex justify-center my-20">
      <main className="w-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Books</h1>
        <section className="p-2">
          {/* input form */}
          <div className="mb-4 space-y-2">
            <div>
              <Label htmlFor="name" className="font-semibold">
                Book Title
              </Label>
              <Input
                id="name"
                value={book.name}
                placeholder="name"
                onChange={(e) => setBook({ ...book, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description" className="font-semibold">
                Description
              </Label>
              <Input
                id="description"
                value={book.description}
                placeholder="description"
                onChange={(e) =>
                  setBook({ ...book, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="isbn" className="font-semibold">
                ISBN
              </Label>
              <Input
                id="isbn"
                value={book.isbn}
                placeholder="isbn"
                onChange={(e) => setBook({ ...book, isbn: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="author" className="font-semibold">
                Author
              </Label>
              <Input
                id="author"
                value={book.author}
                placeholder="author"
                onChange={(e) => setBook({ ...book, author: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="upload">Upload</Label>
              <Input
                id="upload"
                type="file"
                onChange={(e) =>
                  setBook({ ...book, file: e.target.files as FileList })
                }
              />
            </div>
          </div>
          <Button
            onClick={() => {
              handleAddBook(book);
            }}
          >
            Submit book
          </Button>
        </section>
        {query.data?.length === 0 ? <div>There is no data</div> : null}
        <section>
          {query.data?.map((book) => {
            return (
              <div key={book._id}>
                <div>{book.name}</div>
                <div>{book.description}</div>
                <div>{book.isbn}</div>
                <div>{book.author}</div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}