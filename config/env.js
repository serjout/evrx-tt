let ETH_ENV = 'live'

if (typeof process !== undefined && process.env.ETH_ENV) {
    ETH_ENV = process.env.ETH_ENV;
}

module.exports  = { ETH_ENV };