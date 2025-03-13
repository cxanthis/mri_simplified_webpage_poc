// app/mri-fundamentals/layout.tsx
export default function MRIFundamentalsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Adjust the heights as needed; for instance, if your Navbar is 64px and Footer is 48px:
    const totalOffset = 64 + 48;

    return (
        <div style={{ height: `calc(100vh - ${totalOffset}px)` }} className="flex flex-col w-full">
                {children}
        </div>
    );
}
