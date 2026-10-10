## MODIFIED Requirements

### Requirement: `/` ランディングは Hero セクションから始まる

`/` ルートは最上段に Hero.html 準拠の Hero セクションを描画しなければならない（MUST）。Hero セクションは（1）`withPulse` 付き `Eyebrow`、（2）日本語呼称（任意）と英語名の巨大 2 段タイポ（英語名の末尾ピリオドは indigo→violet→pink グラデーションのテキストクリップ）、（3）肩書きを `<span class="sep">` 相当の 45 度回転 violet 矩形で区切った titles 列、（4）640px 幅 max のタグライン、（5）`Button` primary（メインアクション）+ `Button` ghost（podcast 等のサブアクション）の CTA 行、（6）右端に side-meta 列を含まなければならない（MUST）。Hero セクションはアンカー `id="hero"` を持たなければならない（MUST）。

Hero セクション内では、最初の HTML（SSR 出力）に `Orb` primitive を背景レイヤーとして含めなければならない（MUST）。トップページ背面の `ParticleField` が WebGL の描画を始めたあとは、`Orb` を不可視（`visibility: hidden` かつ `opacity: 0`、opacity のトランジション付き）にしなければならない（MUST）。WebGL が使えない場合・JS が無効な場合・WebGL コンテキストを失った場合は、`Orb` を表示したままにしなければならない（MUST）。

文字情報は **Hero.html のビジュアル構造を保ちつつ、コンテンツはサイト所有者の現在の活動に置き直さなければならない**（MUST）。肩書き列は、所有者の現在の活動に対応する肩書きで構成しなければならない（MUST）。現状は次の 2 つとする。

- "Engineering Manager": 現行プロフィール（`src/config/constants.ts` の `globalDescription`）に対応する
- "Music Producer": INKDOSE での音楽活動に対応する（HeroStrip の Discography と、CTA の "Listen to my music" と同じ活動）

Hero.html のサンプル肩書きを、所有者の活動に対応しないまま流用してはならない（MUST NOT）。タグラインは `globalDescription` を 1〜2 文に圧縮した内容でなければならない（MUST）。

#### Scenario: Hero セクションが Hero.html の構造を再現する

- **WHEN** ユーザーが `/` にアクセスしたとき
- **THEN** Eyebrow + 巨大 name タイポ + titles + tagline + CTA row + side-meta が Hero.html と同じ上から下への順序で描画される

#### Scenario: Hero 末尾ピリオドがグラデーションで描画される

- **WHEN** 英語名の末尾ピリオドを DOM 検査したとき
- **THEN** `background-clip: text` と `color: transparent` を持つスパン要素としてレンダリングされ、背景は `var(--color-brand-orb-indigo/violet/pink)` のリニアグラデーションである

#### Scenario: 肩書きが所有者の現在の活動に対応している

- **WHEN** Hero セクションの titles 列を確認したとき
- **THEN** "Engineering Manager" と "Music Producer" が表示され、どちらもページ内の活動（プロフィール、INKDOSE の Discography と音楽への CTA）に対応している。対応する活動がページに無い肩書きは表示されない

#### Scenario: 最初の HTML に Orb が含まれる

- **WHEN** `/` のサーバー描画結果（SSR の HTML）を確認したとき
- **THEN** Hero セクション内に `Orb` primitive（`tb-orb-wrap`）が含まれる

#### Scenario: パーティクル背景が動いている間は Orb を隠す

- **WHEN** `ParticleField` が WebGL の描画を始めたとき
- **THEN** Hero の `Orb` を包む要素が `invisible` と `opacity-0` になる

#### Scenario: WebGL が使えないときは Orb が残る

- **WHEN** ブラウザが WebGL コンテキストを返さないとき
- **THEN** `ParticleField` は canvas を描画せず、Hero の `Orb` は表示されたままである

## ADDED Requirements

### Requirement: `/` は背面にパーティクル背景を描画し、セクションごとに形を変える

`/` は、ページのコンテンツ全体の背面に `ParticleField` を 1 つだけ描画しなければならない（MUST）。`ParticleField` はコンテンツを包む `relative` な要素の最初の子として配置し、コンテンツはその兄弟要素として `relative` かつより大きい z-index で描画しなければならない（MUST）。パーティクルはコンテンツ（テキスト・カード・埋め込み・ボタン）の上に描画されてはならず、クリックやフォーカスを妨げてはならない（MUST NOT）。パーティクルはフッターに重なってはならない（MUST NOT）。

同じ粒が、スクロール位置に応じて次の形に組み替わらなければならない（MUST）。対応は `src/features/home/Home.page.tsx` の `particleStages`（セクション `id` と形の番号の対応表）で定義しなければならない（MUST）。

| セクション id         | 形                        |
| --------------------- | ------------------------- |
| `hero`                | 0: 自転する球             |
| `podcast` / `youtube` | 1: 重なった音の波形       |
| `services` / `works`  | 2: 明滅する格子           |
| `articles`            | 3: 縦に流れる雨           |
| `contact`             | 4: 傾いたリングと明るい芯 |

形の切り替えは、次のセクションの上端がビューポートの上半分を通過する間に行わなければならない（MUST）。切り替えの途中では、粒は前の形からほどけて散り、次の形にまとまらなければならない（MUST）。`particleStages` にないブロック（例: HeroStrip）や、同じ形が続くセクションでは、形を保たなければならない（MUST）。ページを開いた直後（スクロール位置の復元やハッシュへの移動を含む）は、途中の形を経由せず、その位置の形を表示しなければならない（MUST）。

アクセントは Hero の形（0）だけでなければならず、それ以外の形は Hero より明らかに暗く描画しなければならない（MUST）。`prefers-reduced-motion: reduce` のときは時間を止め、形は補間せずにスクロール位置に応じて切り替えなければならない（MUST）。

#### Scenario: particleStages の id がすべてトップページに存在する

- **WHEN** `/` を描画し、`particleStages` の各 `id` を DOM で検索したとき
- **THEN** すべての `id` に対応する要素が存在する

#### Scenario: セクションに入ると形が切り替わる

- **WHEN** ユーザーが Services セクションまでスクロールし、Services の上端がビューポートの上部に達したとき
- **THEN** パーティクルは格子の形（2）で描画される

#### Scenario: 同じ形が続く区間とアンカーのない区間では形を保つ

- **WHEN** スクロール位置が Podcast と YouTube の間、または Hero と Podcast の間（HeroStrip）にあるとき
- **THEN** 形の番号は直前のセクションの値から変わらない

#### Scenario: ページ途中で開いたときに最初から正しい形が出る

- **WHEN** ユーザーが `/#works` を直接開いたとき
- **THEN** 球から順に形を経由せず、格子の形（2）で描画される

#### Scenario: フッターに重ならない

- **WHEN** ユーザーがページの最下部までスクロールしたとき
- **THEN** パーティクルの描画領域の下端はフッターの上端より上にある

#### Scenario: reduced-motion では動かない

- **WHEN** `prefers-reduced-motion: reduce` の環境でユーザーがスクロールしたとき
- **THEN** 粒は時間経過で動かず、セクションが変わったときだけ次の形に切り替わる
