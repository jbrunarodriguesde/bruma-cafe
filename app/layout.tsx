import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Bruma Café — Uma pausa com mais sabor',description:'Cafés especiais, comida feita com tempo e encontros que ficam. Cafeteria fictícia para demonstração.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="pt-BR"><body>{children}</body></html>}
