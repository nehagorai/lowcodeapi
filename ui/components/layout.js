
import moment from "moment";
import Footer from "./Footer"
import Header from "./Header"
import Info from '@/static-json/info';

const Layout = ({ api_count, copyright, children, hideFooter=false  }) => {
  return (
    <div className="flex flex-col min-h-screen bg-pattern">
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6">
        <Header brand={Info.name} brandName={Info.name} api_count={api_count} brand={Info.name} />
        <div className="">
        {children}
        </div>
      </main>
      {
        hideFooter 
        ? null
        : <Footer year={moment().format("YYYY")} copyright={copyright} brand={Info.name} />
      }
    </div>
  )
}

export default Layout
