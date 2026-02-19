import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Execute docker stats with JSON formatting
    // Note: --format json outputs one JSON object per line for each container
    // We need to wrap it or parse it line by line
    const { stdout } = await execPromise('docker stats --no-stream --format "{{json .}}"');
    
    // Split by newlines and filter empty lines
    const lines = stdout.trim().split('\n').filter(line => line);
    
    // Parse each line as JSON
    const containers = lines.map(line => JSON.parse(line));
    
    return NextResponse.json({ containers });
  } catch (error: any) {
    console.error('Error fetching docker stats:', error);
    
    // Fallback or error message
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}
