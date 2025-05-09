"use client"
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
export default function TranslatedContent() {
 
  
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("language.title")}</h2>
        <p>{t("app.tagline")}</p>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("common.title", "Common Elements")}</h2>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">{t("common.save")}</Button>
          <Button size="sm" variant="outline">{t("common.cancel")}</Button>
          <Button size="sm" variant="destructive">{t("common.delete")}</Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">{t("nav.title", "Navigation")}</h2>
        <div className="flex flex-wrap gap-4">
          <a href="#" className="hover:underline">{t("nav.home")}</a>
          <a href="#" className="hover:underline">{t("nav.restaurants")}</a>
          <a href="#" className="hover:underline">{t("nav.orders")}</a>
          <a href="#" className="hover:underline">{t("nav.account")}</a>
        </div>
      </div>
    </div>
  );
}