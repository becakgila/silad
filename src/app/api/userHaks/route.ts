import { NextRequest } from "next/server";
import prisma from '@/lib/prisma'
import { create } from "domain";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		const modulIdParam = searchParams.get('modul_id');
		const userIdParam = searchParams.get('user_id');

		const where: any = {};

		if (modulIdParam) {
			const modulId = Number(modulIdParam);
			if (!isNaN(modulId)) where.modul_id = modulId;
		}

		if (userIdParam) {
			const userId = Number(userIdParam);
			if (!isNaN(userId)) where.user_id = userId;
		}

		// If no conditions provided, this will return all user_haks
		const data = await prisma.user_haks.findFirst({
			where,
		});

        if(data){
            const serialized = {
                ...data,
                hakid: data.hakid.toString(),
            };
    
            return new Response(JSON.stringify({ message: 'User hak fetched', data: serialized }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ message: 'User hak not found', data: null }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

	} catch (error: unknown) {
		return new Response(JSON.stringify({ message: 'Error fetching user hak', error: String(error) }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}

export async function PATCH(request: NextRequest) {
	try {
		
		const body = await request.json();
		const {where, data} = body;

		const getHak = await prisma.user_haks.findFirst({
			where,
		});

		console.log(getHak, 'ini get hak sebelum update');
		

		const updatedHak = await prisma.user_haks.updateMany({
			where: where,
			data: {...data, updated_at: new Date(),},
			
		});	

		if(updatedHak.count === 0){
			const created= await prisma.user_haks.create({
				data: {
					...where,
					...data,
					created_at: new Date(),
					updated_at: new Date(),
				}
			});

			console.log(created);
			
		}

		return new Response(JSON.stringify({ message: 'User hak updated', data: updatedHak }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error: unknown) {
		console.log();
		
		return new Response(JSON.stringify({ message: 'Error updating user hak', error: String(error) }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
}
