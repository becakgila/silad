import { NextRequest } from "next/server";

export async function GET(req: Request) {

  

}

export async function POST(req: NextRequest) {

  const data = await req.formData();

  console.log(data);
  

  return new Response(JSON.stringify({
    data: {},
    message: "ajuan dok berhasil di buat"
  }))

}