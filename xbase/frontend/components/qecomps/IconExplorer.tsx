'use client';
import { useEffect, useState } from 'react';
import WindowFloat from './WindowFloat';
import { SSRGlobal } from './Context';
import Img from './Img';
import TextBox from './TextBox';

type FileItem = {
  name: string;
  path: string;
  isImage: boolean;
  isDirectory: boolean;
};

const FILE_HOST = 'https://cdn.ituring.ir/qepal';
const TOKEN = 'googoolians';

const IconExplorer = (props: { on: (url) => void }) => {
  let z = SSRGlobal();

  const [allFiles, setAllFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [displayItems, setDisplayItems] = useState<FileItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>(''); // new search term state

  useEffect(() => {
    (async () => {
      fetch(`${FILE_HOST}/?token=${TOKEN}`)
        .then(res => res.json())
        .then((data: string[]) => {
          if (Array.isArray(data)) {
            setAllFiles(data);
            buildDisplay(data, '', '');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch files:', err);
          setLoading(false);
        });
    })();
  }, []);

  const buildDisplay = (files: string[], path: string, search: string) => {
    const folders = new Set<string>();
    const images: FileItem[] = [];

    files.forEach(filePath => {
      if (!filePath.startsWith(path)) return;

      const subPath = filePath.slice(path.length);
      const parts = subPath.split('/');

      if (parts.length === 1) {
        const name = parts[0];
        if (search && !name.toLowerCase().includes(search.toLowerCase())) return;

        const ext = name.split('.').pop()?.toLowerCase();
        const isImage = ['svg', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');
        if (isImage) {
          images.push({ name, path: filePath, isImage: true, isDirectory: false });
        }
      } else {
        const folderName = parts[0];
        if (search && !folderName.toLowerCase().includes(search.toLowerCase())) return;
        folders.add(folderName);
      }
    });

    const folderItems: FileItem[] = Array.from(folders).map(name => ({
      name,
      path: path + name + '/',
      isImage: false,
      isDirectory: true,
    }));

    setDisplayItems([...folderItems, ...images]);
  };

  const enterFolder = (folderPath: string) => {
    setHistory(prev => [...prev, currentPath]);
    setCurrentPath(folderPath);
    buildDisplay(allFiles, folderPath, searchTerm);
  };

  const goBack = () => {
    const prev = [...history];
    const last = prev.pop() || '';
    setHistory(prev);
    setCurrentPath(last);
    buildDisplay(allFiles, last, searchTerm);
  };

  const handleSearch = (txt: string) => {
    setSearchTerm(txt);
    buildDisplay(allFiles, currentPath, txt);
  };

  return (
    <WindowFloat
      style={{ direction: z.lang.dir }}
      title="جست‌وجوگر آیکون"
      z={10000}
      maxWidth={loading ? null : "100vw"}
      onclose={() => { props.on(null) }}
    >
      <TextBox title="جست و جو" defaultValue={searchTerm} on={handleSearch} style={{ padding: "0 20px" }} />
      <br-x/>
      {loading ? (
        <f-cc>
          <Img src={cdn("/files/loadingc.svg")} style={{ width: 80, height: 80 }} />
        </f-cc>
      ) : (
        <div style={styles.container}>
          <div style={styles.grid}>
            {currentPath && (
              <div style={styles.item} onClick={goBack}>
                <div style={styles.folder}>
                  <div style={styles.folderIcon}>⬅</div>
                  <div style={styles.name}>Back</div>
                </div>
              </div>
            )}

            {displayItems.map((item, idx) => {
              const fileUrl = `${FILE_HOST}/${item.path}`;
              return (
                <div
                  key={idx}
                  style={styles.item}
                  onClick={() => item.isDirectory && enterFolder(item.path)}
                >
                  {item.isImage ? (
                    <img
                      src={fileUrl}
                      alt={item.name}
                      style={styles.image}
                      onClick={() => { props.on?.(fileUrl) }}
                    />
                  ) : (
                    <div style={styles.folder}>
                      <div style={styles.folderIcon}>📁</div>
                      <div style={styles.name}>{item.name}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <br-x />
    </WindowFloat>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '1rem',
    maxWidth: '1200px',
    maxHeight: '60vh',
    overflowY: "scroll",
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '1.5rem',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
    gap: '0.75rem',
  },
  item: {
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    padding: '0.5rem',
    textAlign: 'center',
    backgroundColor: '#fff',
    transition: '0.2s',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  image: {
    width: '50px',
    height: '50px',
    objectFit: 'contain',
    borderRadius: '6px',
    backgroundColor: '#f0f0f0',
    margin: '0 auto 0.5rem',
    padding: '0.25rem',
  },
  folder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '0.85rem',
  },
  folderIcon: {
    fontSize: '1.5rem',
    marginBottom: '0.4rem',
    color: '#555',
  },
  name: {
    wordBreak: 'break-word',
  },
};

export default IconExplorer;
