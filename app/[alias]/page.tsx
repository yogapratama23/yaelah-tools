import { checkUrlByAlias } from "@/lib/actions/url.action"
import { redirect } from "next/navigation";

export default async function Page({
    params,
  }: {
    params: Promise<{ alias: string }>
  }) {
    const alias = (await params).alias
    const checkUrl = await checkUrlByAlias(alias);
    
    if (!checkUrl.data) {
        return <div>URL NO LONGER VALID</div>
    }

    return redirect(checkUrl.data.longUrl);
  }