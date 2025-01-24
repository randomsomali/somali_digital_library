// components/ui/visually-hidden.tsx
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="absolute w-px h-px -m-px overflow-hidden clip-rect(0, 0, 0, 0) whitespace-nowrap">
      {children}
    </span>
  );
};

export default VisuallyHidden;
