export async function readText (filename:string): Promise<string> {
    using file = await Deno.open(filename, { read: true });
    const fileInfo = await file.stat();
    const buf = new Uint8Array(fileInfo.size);
    await file.read(buf);
    return new TextDecoder().decode(buf);
}

export async function readLines(filename:string): Promise<string[]> {
    const text:string = await readText(filename);
    return text.trim().split('\n');
}

export async function readGrid(filename:string): Promise<string[][]> {
    const lines:string[] = await readLines(filename);
    return lines.map(x => [...x])
}