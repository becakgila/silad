import prisma from './prisma';

export type ModulNavItem = {
  modul_id: bigint;
  name: string;
  icon: string;
  path: string;
  children?: ModulNavItem[];
  newtab: boolean;
  akses: string;
};

export async function getNavigationModuls(): Promise<ModulNavItem[]> {
  const moduls : [any] = await prisma.moduls.findMany({
    where: {
      modul_aktif: 'yes'
    },
    orderBy: {
      modul_urut: 'asc'
    }
  });

  // Convert flat list to hierarchical structure
  const modulMap = new Map<number, ModulNavItem>();
  const rootModuls: ModulNavItem[] = [];

  moduls.forEach(modul => {
    const navItem: ModulNavItem = {
      modul_id: modul.modul_id,
      name: modul.modul_name,
      icon: modul.modul_simbol,
      path: modul.modul_url,
      newtab: modul.modul_newtab === 'yes',
      akses: modul.modul_akses,
      children: []
    };

    modulMap.set(Number(modul.modul_id), navItem);

    if (modul.modul_induk === 0) {
      rootModuls.push(navItem);
    } else {
      const parent = modulMap.get(modul.modul_induk);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(navItem);
      }
    }
  });

  return rootModuls;
}