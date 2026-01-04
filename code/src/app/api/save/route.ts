import { NextResponse } from 'next/server';
import fs from 'fs';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST(req: Request) {
  try {
    const { count } = await req.json();

    // 1. Write the count to a JSON file (This is our "Database")
    const data = { grindLevel: count, timestamp: new Date().toISOString() };
    fs.writeFileSync('grind-log.json', JSON.stringify(data, null, 2));

    // 2. The Hacker Move: Run Git commands programmatically
    // We commit this specific file
    await execPromise('git config --global user.email "monkey@empire.com"');
    await execPromise('git config --global user.name "Empire Builder"');
    await execPromise('git add grind-log.json');
    await execPromise(`git commit -m "Empire Update: Grind Level ${count} 🚀"`);
    await execPromise('git push');

    return NextResponse.json({ message: "Empire Synced!" });
  } catch (error) {
    console.error("Git Error:", error);
    return NextResponse.json({ message: "Sync Failed" }, { status: 500 });
  }
}