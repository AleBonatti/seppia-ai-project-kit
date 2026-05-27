export function MenuRenderer({ items }: { items: MenuItem[] }) {
    return (
        <nav>
            {items.map((item) => (
                <a key={item.path} href={item.path}>
                    {item.label}
                </a>
            ))}
        </nav>
    );
}
