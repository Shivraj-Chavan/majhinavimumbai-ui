// app/layout.js
import './../../globals.css'
import { ReduxProvider } from "@/redux/provider"; 
import DashboardLayout from "./DashboardLayout/page";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <DashboardLayout>
          {children}
          </DashboardLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}
