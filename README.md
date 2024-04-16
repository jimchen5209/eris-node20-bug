# eris-node20-bug

## Description
An example project to reproduce the bug in eris on Node.js v20.  
Audio files being cut off while playing a pcm file, when running on Node.js v18 it works fine.

## How to use

1. Clone the repository
2. Install the dependencies
    ```bash
    corepack enable
    yarn
    ```
3. Fill env
    ```bash
    cp .env.example .env
    ```
    Fill the .env file with the correct values
4. Build the project
    ```bash
    yarn build
    ```
5. Run the project
    ```bash
    yarn start
    ```
6. Command list:
    - `@<your bot> help` - This help text
    - `@<your bot> join` - Join the voice channel you are in.
    - `@<your bot> leave` - Leave the voice channel.
    - `@<your bot> play-opus` - Play the example opus file.
    - `@<your bot> play-pcm` - Play the example pcm file.
