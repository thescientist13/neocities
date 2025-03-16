import { html, LitElement, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { when } from "lit/directives/when.js";
import { installCommands, type PackageManager } from "../../constants/prefs.ts";
import base from "../../styles/base.css?type=raw";
import dracula from "../../styles/themes/dracula.css?type=raw";
import githubLight from "../../styles/themes/github-light.css?type=raw";
import typography from "../../styles/typography.css?type=raw";
import { frontmatterIsSet } from "../../utils/index.ts";
import "../focus-group/focus-group.ts";
import pkgInfo from "./pkg-info.css?type=raw";

@customElement("pkg-info")
export default class PkgInfo extends LitElement {
  static styles = [
    unsafeCSS(base),
    unsafeCSS(typography),
    unsafeCSS(githubLight),
    unsafeCSS(dracula),
    unsafeCSS(pkgInfo),
  ];

  @property({ type: String, attribute: "dev-dep" })
  devDep = "";

  @property({ type: String })
  pkg = "";

  @property({ type: String })
  repo = "";

  @property({ type: String })
  docs = "";

  @property({ type: Boolean, attribute: "include-install" })
  includeInstall = false;

  @state()
  theme = "dark";

  #retrieveTheme() {
    this.theme = document.documentElement.dataset.theme ?? "dark";
  }

  #observer =
    typeof MutationObserver === "undefined"
      ? null
      : new MutationObserver(() => {
          this.#retrieveTheme();
        });

  connectedCallback() {
    super.connectedCallback();
    this.#observer?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  @state()
  packageManager: PackageManager = "pnpm";

  #retrievePackageManager() {
    this.packageManager =
      (document.documentElement.dataset.pm as PackageManager | undefined) ??
      "pnpm";
  }

  #setPackageManager(newValue: PackageManager) {
    this.packageManager = newValue;
    document.documentElement.dataset.pm = newValue;
    localStorage.setItem("packageManager", newValue);
  }

  firstUpdated() {
    this.#retrieveTheme();
    this.#retrievePackageManager();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#observer?.disconnect();
  }

  render() {
    const { devDep, pkg, repo, docs, includeInstall, packageManager } = this;
    return html`
      <div data-theme=${this.theme}>
        <focus-group>
          ${when(
            frontmatterIsSet(docs) && docs,
            () => html`
              <a href="${docs}" target="_blank" rel="noopener noreferrer">
                <material-symbol aria-hidden="true"
                  >developer_guide</material-symbol
                >
                Docs
              </a>
              |
            `,
          )}
          <a
            href="https://www.npmjs.com/package/${pkg}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <material-symbol aria-hidden="true">deployed_code</material-symbol>
            NPM
          </a>
          |
          <a
            href="https://github.com/${repo}"
            target="_blank"
            rel="noopener noreferrer"
          >
            <material-symbol aria-hidden="true">code</material-symbol>
            GitHub
          </a>
        </focus-group>
        ${when(
          includeInstall,
          () => html`
            <div class="install">
              <fieldset
                class="install-buttons"
                @change=${(ev: Event) => {
                  this.#setPackageManager(
                    (ev.target as HTMLInputElement).value as PackageManager,
                  );
                }}
              >
                ${repeat(
                  Object.keys(installCommands),
                  (key) => key,
                  (key) => html`
                    <input
                      type="radio"
                      class="button"
                      name="package-manager"
                      value=${key}
                      aria-label="Install with ${key}"
                      ?checked=${this.packageManager === key}
                    />
                  `,
                )}
              </fieldset>
              <pre
                class="language-bash"
              ><code class="language-bash"><span class="token function">${packageManager}</span> <span class="token function">${installCommands[
                packageManager
              ]}</span> ${when(
                frontmatterIsSet(devDep),
                () => html`<span class="token parameter variable">-D</span> `,
              )}${pkg}</code></pre>
            </div>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "pkg-info": PkgInfo;
  }
}
