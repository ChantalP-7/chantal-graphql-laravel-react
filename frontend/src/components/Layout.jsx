import Header from "./header";
import Footer from "./footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
}