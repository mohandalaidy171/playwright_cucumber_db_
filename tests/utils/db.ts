import mysql, { RowDataPacket } from 'mysql2/promise';

interface User extends RowDataPacket {
  id: number;
  username: string;
  password: string;
}

export async function getUserById(id: number): Promise<User | null> {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'commitQuality'
  });

  const [rows] = await connection.execute<User[]>(
    'SELECT id, username, password FROM loginqummit WHERE id = ?',
    [id]
  );

  await connection.end();
  return rows.length > 0 ? rows[0] : null;
}