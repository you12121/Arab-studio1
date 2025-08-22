// src/components/ui/sonner.tsx (النسخة النظيفة والنهائية)

import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  // تم حذف `useTheme` من هنا واستبداله بقيمة ثابتة
  return (
    <Sonner
      theme="light" // قيمة ثابتة لضمان عمل المكون
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

// قمنا بتصدير toast أيضًا لضمان عمله في بقية التطبيق
export { Toaster, toast }
