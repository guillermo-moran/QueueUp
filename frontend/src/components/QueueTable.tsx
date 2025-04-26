import styled from 'styled-components';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px;
  background-color: #000;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #ddd;
`;

type Song = {
  id: string;
  title: string;
  youtubeId: string;
  thumbnail: string;
};

type Props = {
  queue: Song[];
  onDelete: (id: string) => void;
};

export const QueueTable = ({ queue, onDelete }: Props) => (
  <Table>
    <thead>
      <tr>
        <Th>Thumbnail</Th>
        <Th>Title</Th>
        <Th>Action</Th>
      </tr>
    </thead>
    <tbody>
      {queue.map(song => (
        <tr key={song.id}>
          <Td>
            <img src={song.thumbnail} alt={song.title} width={60} />
          </Td>
          <Td>{song.title}</Td>
          <Td>
            <button onClick={() => onDelete(song.id)}>Delete</button>
          </Td>
        </tr>
      ))}
    </tbody>
  </Table>
);
