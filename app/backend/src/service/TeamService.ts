import IMatch from '../Interfaces/Match/IMatch';
import ITeam from '../Interfaces/Team/ITeam';
import { ITeamModel } from '../Interfaces/Team/ITeamModel';
import TeamModel from '../models/TeamModel';
import { ServiceResponse } from '../Interfaces/ServiceResponse';
import IMatchModel from '../Interfaces/Match/IMatchModel';
import MatchModel from '../models/MatchModel';
import ITeamLeaderboard from '../Interfaces/Team/ITeamLeaderboard';

export default class TeamService {
  constructor(
    private teamModel: ITeamModel = new TeamModel(),
    private matchModel: IMatchModel = new MatchModel(),
  ) {}

  public async findAllTeams(): Promise<ServiceResponse<ITeam[]>> {
    const teams = await this.teamModel.findAll();
    return { status: 'SUCCESSFUL', data: teams };
  }

  public async findTeamById(id: number): Promise<ServiceResponse<ITeam>> {
    const team = await this.teamModel.findById(id);
    if (!team) return { status: 'NOT_FOUND', data: { message: 'Team not found' } };

    return { status: 'SUCCESSFUL', data: team };
  }

  public static totalPoints(teamMatches: IMatch[], id: number, local: string): number {
    const points = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && local === 'home') {
        if (homeTeamGoals > awayTeamGoals) return acc + 3;
        if (homeTeamGoals === awayTeamGoals) return acc + 1;
      }
      if (awayTeamId === id && local === 'away') {
        if (homeTeamGoals < awayTeamGoals) return acc + 3;
        if (homeTeamGoals === awayTeamGoals) return acc + 1;
      }
      return acc;
    }, 0);

    return points;
  }

  public static totalVictories(teamMatches: IMatch[], id: number, local: string): number {
    const victories = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && local === 'home' && homeTeamGoals > awayTeamGoals) return acc + 1;
      if (awayTeamId === id && local === 'away' && homeTeamGoals < awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return victories;
  }

  public static totalDraws(teamMatches: IMatch[], id: number, local: string): number {
    const draws = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && local === 'home' && homeTeamGoals === awayTeamGoals) return acc + 1;
      if (awayTeamId === id && local === 'away' && homeTeamGoals === awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return draws;
  }

  public static totalLosses(teamMatches: IMatch[], id: number, local: string): number {
    const losses = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && local === 'home' && homeTeamGoals < awayTeamGoals) return acc + 1;
      if (awayTeamId === id && local === 'away' && homeTeamGoals > awayTeamGoals) return acc + 1;
      return acc;
    }, 0);

    return losses;
  }

  public static goalsFavor(teamMatches: IMatch[], id: number, local: string): number {
    const goalsFavor = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && local === 'home') return acc + homeTeamGoals;
      if (awayTeamId === id && local === 'away') return acc + awayTeamGoals;
      return acc;
    }, 0);

    return goalsFavor;
  }

  public static goalsOwn(teamMatches: IMatch[], id: number, local: string): number {
    const goalsOwn = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId, homeTeamGoals, awayTeamGoals } = curr;
      if (homeTeamId === id && local === 'home') return acc + awayTeamGoals;
      if (awayTeamId === id && local === 'away') return acc + homeTeamGoals;
      return acc;
    }, 0);

    return goalsOwn;
  }

  public static totalGames(teamMatches: IMatch[], id: number, local: string): number {
    const totalGames = teamMatches.reduce((acc, curr) => {
      const { homeTeamId, awayTeamId } = curr;
      if (homeTeamId === id && local === 'home') return acc + 1;
      if (awayTeamId === id && local === 'away') return acc + 1;
      return acc;
    }, 0);

    return totalGames;
  }

  public static teamWithPoints(teamName: string, teamMatches: IMatch[], id: number, local: string):
  ITeamLeaderboard {
    const points = TeamService.totalPoints(teamMatches, id, local);
    const totalGames = TeamService.totalGames(teamMatches, id, local);
    const losses = TeamService.totalLosses(teamMatches, id, local);
    const goalsFavor = TeamService.goalsFavor(teamMatches, id, local);
    const goalsOwn = TeamService.goalsOwn(teamMatches, id, local);
    return {
      name: teamName,
      totalPoints: points,
      totalGames,
      totalVictories: TeamService.totalVictories(teamMatches, id, local),
      totalDraws: TeamService.totalDraws(teamMatches, id, local),
      totalLosses: losses,
      goalsFavor,
      goalsOwn,
      goalsBalance: goalsFavor - goalsOwn,
      efficiency: Number(((points / (totalGames * 3)) * 100).toFixed(2)),
    };
  }

  public static teamClassification(teams: ITeamLeaderboard[]): ITeamLeaderboard[] {
    return teams.sort((a, b) => {
      switch (true) {
        case a.totalPoints > b.totalPoints:
          return -1;
        case a.totalPoints < b.totalPoints:
          return 1;
        case a.totalVictories > b.totalVictories:
          return -1;
        case a.totalVictories < b.totalVictories:
          return 1;
        case a.goalsBalance > b.goalsBalance:
          return -1;
        case a.goalsBalance < b.goalsBalance:
          return 1;
        default: return a.goalsFavor > b.goalsFavor
          ? -1 : 1;
      }
    });
  }

  public async leaderboard(local: string): Promise<ServiceResponse<ITeamLeaderboard[]>> {
    const teams = await this.teamModel.findAll();
    const matches = await this.matchModel.findAll();

    const teamsLeaderboard = teams.map((team) => {
      const { id } = team;
      const teamMatches = matches.filter((match) => (match.homeTeamId === id
        || match.awayTeamId === id) && match.inProgress === false);
      return TeamService.teamWithPoints(team.teamName, teamMatches, id, local);
    });

    const teamsLeaderboardSorted = TeamService.teamClassification(teamsLeaderboard);

    return { status: 'SUCCESSFUL', data: teamsLeaderboardSorted };
  }
}
