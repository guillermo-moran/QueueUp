import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #0e0b1f; /* Optional: a matching dark background */
  color: white;
`;


export const Header = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export const Card = styled.div`
  background: #2c223e;
  border-radius: 16px;
  padding: 16px;
  width: 90vw;
  margin-bottom: 24px;
`;

export const NowPlayingTitle = styled.div`
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 12px;
`;

export const NowPlayingInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const NowPlayingThumbnail = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 12px;
  margin-right: 12px;
`;

export const SongTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
`;

export const SubTitle = styled.div`
  font-size: 13px;
  color: #b5aecd;
`;

export const SearchInput = styled.input`
  width: 99%;
  height: 46px;
  font-size: 14px;
  border-radius: 12px;
  border: 2px solid #7e6dc1;
  background: #2c223e;
  color: white;
  margin-bottom: 20px;
  text-indent: 12px;

  &::placeholder {
    color: #b5aecd;
  }
`;

export const ResultCard = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const ResultThumbnail = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  margin-right: 12px;
`;

export const ResultText = styled.div`
  flex: 1;
`;

export const AddButton = styled.button`
  background: #8a6cff;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 6px 16px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;

export const FeedbackCard = styled(Card)`
  background: #41325d;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  color: #d7cfff;
`;
