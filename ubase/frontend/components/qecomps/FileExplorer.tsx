'use client';
import { useEffect, useState } from 'react';
import WindowFloat from './WindowFloat';
import { SSRGlobal } from './Context';
import Img from './Img';

type FileItem = {
  name: string;
  path: string;
  isImage: boolean;
  isDirectory: boolean;
};

type FileExplorerProps = {
  on: (url: string | null) => void;
};

const FileExplorer = ({ on }: FileExplorerProps) => {
  const z = SSRGlobal();

  const [filehost] = useState<string>(
    'https://cdn.ituring.ir/qeupload/' + z.middleuser.uid
  );
  const [allFiles, setAllFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [displayItems, setDisplayItems] = useState<FileItem[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Exclusion rules (defined inside component)
  const excludeNames: string[] = ['secret.txt', 'node_modules', 'error_log'];
  const excludePatterns: RegExp[] = [/^\./, /\.log$/, /.*\.php$/];

  // File type icons for specific extensions or names
  const fileTypeIcon: { [key: string]: string } = {
    ".php": "https://cdn.ituring.ir/qepal/php.png",
    ".txt": "https://cdn.ituring.ir/qepal/txt.png",
    ".cpp": "https://cdn.ituring.ir/qepal/cpp.png",
    ".js": "https://cdn.ituring.ir/qepal/js.png",
    ".ts": "https://cdn.ituring.ir/qepal/ts.png",
    ".sh": "https://cdn.ituring.ir/qepal/sh.png",
    ".css": "https://cdn.ituring.ir/qepal/css.png",
    ".ppt": "https://cdn.ituring.ir/qepal/ppt.png",
    ".docx": "https://cdn.ituring.ir/qepal/word.png",
    ".doc": "https://cdn.ituring.ir/qepal/word.png",
    ".tsx": "https://cdn.ituring.ir/qepal/tsx.png",
    ".xml": "https://cdn.ituring.ir/qepal/xml.png",
    ".iso": "https://cdn.ituring.ir/qepal/iso.png",
    ".jsx": "https://cdn.ituring.ir/qepal/tsx.png",
    ".xlsx": "https://cdn.ituring.ir/qepal/excel.png",
    ".csv": "https://cdn.ituring.ir/qepal/excel.png",
    ".dll": "https://cdn.ituring.ir/qepal/dll.png",
    ".json": "https://cdn.ituring.ir/qepal/json.png",
    ".htm": "https://cdn.ituring.ir/qepal/html.png",
    ".html": "https://cdn.ituring.ir/qepal/html.png",
    ".pdf": "https://cdn.ituring.ir/qepal/pdf.png",
    ".cs": "https://cdn.ituring.ir/qepal/csharp.webp",
    ".rar": "https://cdn.ituring.ir/qepal/rar.webp",
    ".zip": "https://cdn.ituring.ir/qepal/rar.webp",
    ".mp3": "https://cdn.ituring.ir/qepal/mp3.png",
    ".mp4": "https://cdn.ituring.ir/qepal/mp4.png",
    ".mov": "https://cdn.ituring.ir/qepal/mov.png",
    ".7z": "https://cdn.ituring.ir/qepal/rar.webp",
    ".exe": "https://cdn.ituring.ir/qepal/exe.png",
    ".psd": "https://cdn.ituring.ir/qepal/psd.png",
    ".sql": "https://cdn.ituring.ir/qepal/sql.png",
    ".yml": "https://cdn.ituring.ir/qepal/yml.png",
    ".bat": "https://cdn.ituring.ir/qepal/bat.png",
    ".flac": "https://cdn.ituring.ir/qepal/flac.png",
  };

  useEffect(() => {
    (async () => {
      try {
        const token = await z.middleuser.tempsecret.generate();
        const res = await fetch(`${filehost}/?token=${token}`);
        const data = (await res.json()) as string[];
        if (Array.isArray(data)) {
          setAllFiles(data);
          buildDisplay(data, '');
        }
      } catch (err) {
        console.error('Failed to fetch files:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [filehost, z.middleuser.tempsecret]);

  useEffect(() => {
    document.body.style.overflowY = "hidden"
    return () => {
      document.body.style.overflowY = "scroll"
    }
  }, [])

  const isExcluded = (filePath: string, name: string) => {
    if (excludeNames.includes(name)) return true;
    return excludePatterns.some(rx => rx.test(name) || rx.test(filePath));
  };

  const buildDisplay = (files: string[], path: string) => {
    const folders = new Set<string>();
    const imageItems: FileItem[] = [];
    const fileItems: FileItem[] = [];

    files.forEach((filePath) => {
      if (!filePath.startsWith(path)) return;

      const subPath = filePath.slice(path.length);
      const parts = subPath.split('/');
      const name = parts[0];

      if (isExcluded(filePath, name)) return;

      if (parts.length > 1) {
        folders.add(name);
        return;
      }

      const ext = name.includes('.') ? '.' + name.split('.').pop()?.toLowerCase() : '';
      const isImage = ['svg', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext.replace('.', ''));

      const item: FileItem = {
        name,
        path: filePath,
        isImage,
        isDirectory: false,
      };

      if (isImage) imageItems.push(item);
      else fileItems.push(item);
    });

    const folderItems: FileItem[] = Array.from(folders)
      .filter(name => !isExcluded(path + name + '/', name))
      .map(name => ({
        name,
        path: path + name + '/',
        isImage: false,
        isDirectory: true,
      }));

    setDisplayItems([...folderItems, ...imageItems, ...fileItems]);
  };

  const enterFolder = (folderPath: string) => {
    setHistory(prev => [...prev, currentPath]);
    setCurrentPath(folderPath);
    buildDisplay(allFiles, folderPath);
  };

  const goBack = () => {
    const prev = [...history];
    const last = prev.pop() || '';
    setHistory(prev);
    setCurrentPath(last);
    buildDisplay(allFiles, last);
  };

  return (
    <WindowFloat
      title="جست‌وجوگر فایل"
      maxWidth={loading ? null : '100vw'}
      z={10000}
      onclose={() => on(null)}
    >
      {loading && (
        <f-cc>
          <Img src={cdn('/files/loadingc.svg')} style={{ width: 80, height: 80 }} />
        </f-cc>
      )}

      {!loading && (
        <div style={styles.container}>
          <w-cse style={{ gap: 10 }}>
            {currentPath && (
              <div style={styles.item} onClick={goBack}>
                <div style={styles.folder}>
                  <div style={styles.folderIcon}>⬅</div>
                  <div style={styles.name}>Back</div>
                </div>
              </div>
            )}

            {displayItems.map((item, idx) => {
              const fileUrl = `${filehost}/${item.path}`;
              const nameStyle = item.isImage ? styles.name : { ...styles.name, fontSize: '10px' };
              let iconSrc: string | null = null;
              if (!item.isImage && !item.isDirectory) {
                iconSrc = fileTypeIcon[item.name] || fileTypeIcon['.' + item.name.split('.').pop()?.toLowerCase()];
              }
              return (
                <div
                  key={idx}
                  style={styles.item}
                  onClick={() => item.isDirectory ? enterFolder(item.path) : on(fileUrl)}
                >
                  {item.isDirectory ? (
                    <div style={styles.folder}>
                      <div style={styles.folderIcon}>📁</div>
                      <div style={nameStyle}>{item.name}</div>
                    </div>
                  ) : item.isImage ? (
                    <img src={fileUrl} alt={item.name} style={styles.image} />
                  ) : (
                    <div style={styles.folder}>
                      {iconSrc ? (
                        <img src={iconSrc} alt="icon" style={{ ...styles.image, width: '100px', height: '100px' }} />
                      ) : (
                        <div style={{ ...styles.folderIcon, width: '100px', height: '100px' }}>📄</div>
                      )}
                      <div style={nameStyle}>{item.name.split("-").slice(0, -1).join("-")}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </w-cse>
        </div>
      )}

      {!loading && <br-x />}
      <br-x />

      <w-cc>
        <sp-3 />
        <b-100
          style={{ backgroundColor: '#68A775' }}
          onClick={async () => {
            const url = await uploader({
              title: 'آپلود فایل',
              text: 'لطفا فایل مورد نظر را انتخاب کنید',
            });
            if (url) on(url);
          }}
        >
          <f-12>{"آپلود (دائمی)"}</f-12>
        </b-100>
        <sp-3 />
        <b-100
          style={{ backgroundColor: '#68A775' }}
          onClick={async () => {
            const url = await uploader({
              title: 'آپلود فایل',
              text: 'لطفا فایل مورد نظر را انتخاب کنید',
              max_age_sec: 86400
            });
            if (url) on(url);
          }}
        >
          <f-12>{"آپلود (یک روزه)"}</f-12>
        </b-100>
        <sp-3 />
        <b-100
          style={{ backgroundColor: '#68A775' }}
          onClick={async () => {
            const url = await uploader({
              title: 'آپلود فایل',
              text: 'لطفا فایل مورد نظر را انتخاب کنید',
              max_age_sec: 3600
            });
            if (url) on(url);
          }}
        >
          <f-12>{"آپلود (یک ساعته)"}</f-12>
        </b-100>
        <sp-3 />
      </w-cc>

    </WindowFloat>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: '1rem',
    maxWidth: '95vw',
    gap: 10,
    maxHeight: '80vh',
    overflowY: "scroll",
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(70px, 1fr))',
    gap: '0.75rem',
  },
  item: {
    // border: global.theme == "dark"?'1px solid #373737':"",
    borderRadius: '10px',
    color: global.theme == "dark" ? "silver" : "black",
    padding: '0',
    textAlign: 'center',
    minWidth: "80px",
    backgroundColor: global.theme == "dark" ? '#3A3A3A' : "white",
    transition: '0.2s',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  image: {
    width: '150px',
    height: '150px',
    objectFit: 'contain',
    borderRadius: '6px',
    backgroundColor: '#f0f0f0',
    margin: '0',
    padding: '0',
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
export default FileExplorer;